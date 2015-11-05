'use strict';

import {Injector} from 'kusema.js';

var I = new Injector('questionService', 'answerService', 'commentService', 'topicService', 'groupService');

var BaseJson = function BaseJson(contentJSON, factory) {
        I.init();
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
        this.upVotes = new Set(this.upVotes);
        this.downVotes = new Set(this.downVotes)
    	return this;
    }
    BaseContent.prototype = Object.create(BaseJson.prototype, {
        name: {writable: false, value: 'BaseContent', enumerable: false},
        constructor: {writable: false, value: BaseContent, enumerable: false},
        author: { writable: true, value: 0, enumerable: true }, //TODO add object ID requirement here
        authorName: { writable: true, value: "", enumerable: true},
        message: { writable: true, value: 0, enumerable: true },
        comments: { writable: true, value: [], enumerable: true},
        upVotes: { writable: true, value: [], enumerable: true },
        downVotes: { writable: true, value: [], enumerable: true},
        score: {get: function() {
            return this.upVotes.size - this.downVotes.size;
        }},
    });
    BaseContent.prototype.upVote = function() {
        this.factory.upVote(this._id)
        .then( (userId) => {this.upVotes.add(userId); this.downVotes.delete(userId)});
              
    };
    BaseContent.prototype.downVote = function() {
        this.factory.downVote(this._id)
        .then( (userId) => {this.downVotes.add(userId); this.upVotes.delete(userId)} );          
    };
    BaseContent.prototype.removeVotes = function() {
        this.factory.removeVotes(this._id)
        .then( (userId) => {this.downVotes.delete(userId); this.upVotes.delete(userId)} );          
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
        BaseContent.call(this, questionJSON, I.questionService);
        if (this.answers) {
            this.answers = I.answerService.createClientModels(this.answers);
        };
        I.groupService.waitForGroups.then(function() {
            if (this.group) {
                this.group = I.groupService.getGroup(this.group);
            }
            if (this.topics) {
                this.topics = I.topicService.getTopics(this.topics);
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
		BaseContent.call(this, commentJSON, I.commentService);
    }
    Comment.prototype = Object.create(BaseContent.prototype, {
        constructor: {writable: false, value: Comment, enumerable: false},
        parent: {writable: true, value: 0, enumerable: true},
    });
//} Comment


var Answer = function Answer(answerJSON, answerFactory) {
        BaseContent.call(this, answerJSON, I.answerService);
    }
    Answer.prototype = Object.create(BaseContent.prototype, {
        name: {writable: false, value: 'Answer', enumerable: false},
        constructor: {writable: false, value: Answer, enumerable: false},
        question: {writable: true, value: null, enumerable: true}
    });
//} Answer


var Group = function Group(groupJSON, groupService) {
        BaseJson.call(this, groupJSON, I.groupService);
        if (this.topics) {
            this.topics = this.topics.map(function(topicID) { return I.topicService.getTopic(topicID); });
        }
    }
    Group.prototype = Object.create(BaseJson.prototype, {
        name: {writable: true, value: '', enumerable: true},
        topics: {writable: true, value: null, enumerable: true},
        unitCode: {writable: true, value: '', enumerable: true},
        title: {writable: true, value: '', enumerable: true}
    });
    // weirdness: if I set prototype.toString, my actually models end up with
    // topic.toString === Object.prototype.toString. No idea why.
    Group.prototype.getString = function() {
        return this.name;
    }

var Topic = function Topic(topicJSON) {
        BaseJson.call(this, topicJSON);
    }
    Topic.prototype = Object.create(BaseJson.prototype, {
        name: {writable: true, value: '', enumerable: true},
    });
    Topic.prototype.getString = function() {
        return this.name;
    }

export {BaseJson, BaseContent, Question, Answer, Comment, Group, Topic};