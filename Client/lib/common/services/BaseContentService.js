'use strict';

import BaseJsonService from './BaseJsonService.js';
import {BaseContent} from 'common/models.js';

var BaseContentService = function($http, kusemaConfig, socketFactory, questionService, answerService, commentService) {
		this.initCommonDeps($http, kusemaConfig, socketFactory);
		this.questionService = questionService;
		this.answerService = answerService;
		this.commentService = commentService;
	}

	BaseContentService.prototype = Object.create(BaseJsonService.prototype, {
		model: {writable: false, enumerable: false, value: BaseContent}
	});

	BaseContentService.prototype.initCommonDeps = function($http, kusemaConfig, socketFactory) {
        BaseJsonService.prototype.initCommonDeps.call(this, $http, kusemaConfig);
		this.socketFactory = socketFactory;
	}

	BaseContentService.prototype.getService = function(serviceNameOrObject) {
		var serviceName;
		if (!serviceNameOrObject) {
			serviceName = null;
		} else {
			if (serviceNameOrObject.__t) {
				serviceName = serviceNameOrObject.__t;
			} else if (serviceNameOrObject.factory) {
				return serviceNameOrObject.factory;
			} else if (typeof serviceNameOrObject == "string") {
				serviceName = serviceNameOrObject;
			}
		}
		
		switch (serviceName.toLowerCase()) {
			case 'question':
				return this.questionService;
				break;
			case 'answer':
				return this.answerService;
				break;
			case 'comment':
				return this.commentService;
				break;
			case 'basecontent':
				console.error('a raw basecontent object is being passed around...');
				return this;
				break;
		}
	}
    BaseContentService.prototype.add = function (content, extraURL) {
    	var content;
    	if (!extraURL) {
    		extraURL = '';
    	}
    	if (extraURL) {
    		extraURL = '/'+extraURL;
    	}
        return this.$http.post(this.urlBase+extraURL, JSON.stringify(content, this.sanitizeJson))
        		   .then(this.modelFromResponse.bind(this));
    };
    BaseContentService.prototype.update = function (id, editedContent) {
        return this.$http.put(this.urlBase + '/' + id, JSON.stringify(editedContent, this.sanitizeJson))
        		   .then(function(response) {return response.data});
    };
    BaseContentService.prototype.upVote = function (id) {
    	return this.$http.put(this.urlBase + '/upvote/' + id);
    };
    BaseContentService.prototype.downVote = function (id) {
    	return this.$http.put(this.urlBase + '/dnvote/' + id);
    };
    BaseContentService.prototype.delete = function (id) {
        return this.$http.delete(this.urlBase + '/' + id);
    };
//} BaseContentService

import kusema from 'kusema.js';
kusema.service('baseContentService', ['$http', 'kusemaConfig', 'socketFactory', 'questionService', 'answerService', 'commentService', 'baseJsonService', BaseContentService]);

export default BaseContentService;
