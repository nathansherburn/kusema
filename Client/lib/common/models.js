'use strict';


var BaseJson = function BaseJson(contentJSON, factory) {
        Object.defineProperty(this, 'factory', {writable:true, value:null, enumerable: false});
        this.factory = factory;
        for (var property in Object.getPrototypeOf(this)) {
            if (contentJSON[property] !== undefined) {
                this[property] = contentJSON[property];
            }
        }
        this.json = contentJSON;
        this.dateCreated = new Date(this.dateCreated);
        this.dateModified = new Date(this.dateModified);
    }

    BaseJson.prototype = Object.create(Object.prototype, {
        constructor: {writable: false, value: BaseJson, enumerable: false},
        json: {writable: true, value: 'BaseContent', enumerable: false},
        _id: {writable: true, value: 0, enumerable: true},
        dateCreated: { writable: true, value: null, enumerable: true },
        dateModified: { writable: true, value: null, enumerable: true },
    })
//} BaseJson


var BaseContent = function BaseContent(contentJSON, factory) {
        BaseJson.call(this, contentJSON, factory);
    	return this;
    }
    BaseContent.prototype = Object.create(BaseJson.prototype, {
        name: {writable: false, value: 'BaseContent', enumerable: false},
        constructor: {writable: false, value: BaseContent, enumerable: false},
        author: { writable: true, value: 0, enumerable: true }, //TODO add object ID requirement here
        authorName: { writable: true, value: "", enumerable: true},
        message: { writable: true, value: 0, enumerable: true },
        comments: { writable: true, value: [], enumerable: true},
        upVotes: { writable: true, value: 0, enumerable: true },
        downVotes: { writable: true, value: 0, enumerable: true},
        score: {get: function() {
            return this.upVotes - this.downVotes;
        }},
    });
    BaseContent.prototype.upVote = function() {
        this.factory.upVote(this._id);
        this.upVotes++;       
    };
    BaseContent.prototype.downVote = function() {
        this.factory.downVote(this._id);
        this.downVotes++;          
    };
    BaseContent.prototype.delete = function() {
        this.factory.delete(this._id);   
    };
    BaseContent.prototype.update = function(newJson) {
        return this.factory.update(this._id, newJson)
                .then(function(updated) {
                    this.constructor.call(this, updated, this.factory);
                    return this;
                }.bind(this));  
    };
//} BaseContent


var Question = function Question(questionJSON, questionService) {
        //we need this to be NON-ENUMERABLE, else we get a circular dependancy when JSON.stringifying. Unfortunately setting non-enumerable on the prototype's property is not enough :(
        BaseContent.call(this, questionJSON, questionService);
        if (this.answers) {
            this.answers = questionService.answerService.createClientModels(this.answers);
        };
        questionService.groupService.waitForGroups.then(function() {
            if (this.group) {
                this.group = questionService.groupService.getGroup(this.group);
            }
            if (this.topics) {
                this.topics = questionService.groupService.topicService.getTopics(this.topics);
            }
        }.bind(this));
        return this;
    }
    Question.prototype = Object.create(BaseContent.prototype, {
        name: {writable: false, value: 'Question', enumerable: false},
        constructor: {writable: false, value: Question, enumerable: false},
        title: { writable: true, value: "", enumerable: true },
        answers: {writable: true, value: null, enumerable: true},
        group: {writable: true, value: null, enumerable: true},
        topics: {writable: true, value: null, enumerable: true}
    });
//} Question


var Comment = function(commentJSON, commentFactory) {
		BaseContent.call(this, commentJSON, commentFactory);
    }
    Comment.prototype = Object.create(BaseContent.prototype, {
        constructor: {writable: false, value: Comment, enumerable: false},
        parent: {writable: true, value: 0, enumerable: true},
    });
//} Comment


var Answer = function Answer(answerJSON, answerFactory) {
        BaseContent.call(this, answerJSON, answerFactory);
    }
    Answer.prototype = Object.create(BaseContent.prototype, {
        constructor: {writable: false, value: Answer, enumerable: false},
        question: {writable: true, value: null, enumerable: true}
    });
//} Answer


var Group = function Group(groupJSON, groupService) {
        BaseJson.call(this, groupJSON, groupService);
        if (this.topics) {
            this.topics = this.topics.map(function(topicID) { return groupService.topicService.getTopic(topicID); });
        }
    }
    Group.prototype = Object.create(BaseJson.prototype, {
        name: {writable: true, value: '', enumerable: true},
        topics: {writable: true, value: null, enumerable: true},
        unitCode: {writable: true, value: '', enumerable: true},
        title: {writable: true, value: '', enumerable: true}
    });

var Topic = function Topic(topicJSON) {
        BaseJson.call(this, topicJSON);
    }
    Topic.prototype = Object.create(BaseJson.prototype, {
        name: {writable: true, value: '', enumerable: true},
    });

export {BaseJson, BaseContent, Question, Answer, Comment, Group, Topic};