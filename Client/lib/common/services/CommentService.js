'use strict';

import BaseContentService from './BaseContentService.js';
import {Comment} from 'common/models.js';

var CommentSubscription = function(socketFactory, commentFactory, baseContent, callback) {
	    this.callback = callback;
	    this.socketFactory = socketFactory;
	    this.commentFactory = commentFactory;
	    this.baseContent = baseContent;
	    this.socketFactory.watchContent(this.baseContent);
	    this.socketFactory.on('contentChanged', this.contentChanged.bind(this));
	    return this;
	}
	CommentSubscription.prototype.contentChanged = function(newContent) {
	    console.log('got message');
	    if (newContent.comments && newContent._id == this.baseContent._id) {
	        console.log('calling back');
	        this.callback(this.commentFactory.createClientModels(newContent.comments));
	    }
	}
	CommentSubscription.prototype.cancel = function() {
	    this.socketFactory.unwatchContent(this.baseContent);
	}
//} CommentSubScription


var CommentService = function($http, kusemaConfig, socketFactory) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);
        this.urlBase = 'api/comments';
    }

	CommentService.prototype = Object.create(BaseContentService.prototype, {
		model: {writable: false, enumerable: false, value: Comment}
	});

    CommentService.prototype.getComments = function (id) {
        return this.$http.get(this.urlBase + '/' + id)
                   .then(this.modelFromResponse.bind(this));
    };

    CommentService.prototype.add = function (comment) {
		return BaseContentService.prototype.add.call(this, comment, comment.parent);
    };
    CommentService.prototype.subscribeTo = function(baseContent, callback) {
        return new CommentSubscription(this.socketFactory, this, baseContent, callback);
    }
//} CommentService 

import kusema from 'kusema.js';
kusema.service('commentService', ['$http', 'kusemaConfig', 'socketFactory', CommentService]);

export default CommentService;