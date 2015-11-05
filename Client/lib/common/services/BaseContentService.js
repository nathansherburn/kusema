'use strict';

import BaseJsonService from './BaseJsonService.js';
import {BaseContent} from 'common/models.js';
import {Injector} from 'kusema.js';

var I = new Injector('$http', 'socketFactory', 'loginService');
var sI = new Injector('questionService', 'answerService', 'commentService');

var BaseContentService = function(inheriting) {
		BaseJsonService.call(this);
		I.init();
		if (!inheriting) {
			sI.init();

			this.getService = function(serviceNameOrObject) {
				var serviceName;
				if (!serviceNameOrObject) {
					serviceName = '';
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
						return sI.questionService;
						break;
					case 'answer':
						return sI.answerService;
						break;
					case 'comment':
						return sI.commentService;
						break;
					case 'basecontent':
						console.error('a raw basecontent object is being passed around...');
					default:
						return this;
						break;
				}
			}

		}
	}

	BaseContentService.prototype = Object.create(BaseJsonService.prototype, {
		model: {writable: false, enumerable: false, value: BaseContent}
	});

    BaseContentService.prototype.add = function (content, extraURL) {
    	var content;
    	if (!extraURL) {
    		extraURL = '';
    	}
    	if (extraURL) {
    		extraURL = '/'+extraURL;
    	}
        return I.$http.post(this.urlBase+extraURL, JSON.stringify(content, this.sanitizeJson))
        		   .then(this.modelFromResponse.bind(this));
    };
    BaseContentService.prototype.update = function (id, editedContent) {
        return I.$http.put(this.urlBase + '/' + id, JSON.stringify(editedContent, this.sanitizeJson))
        		   .then(function(response) {return response.data});
    };
    BaseContentService.prototype.upVote = function (id) {
    	return I.$http.put(this.urlBase + '/upvote/' + id)
    	.then( (response) => I.loginService.bindables.user._id);
    };
    BaseContentService.prototype.downVote = function (id) {
    	return I.$http.put(this.urlBase + '/downvote/' + id)
    	.then( (response) => I.loginService.bindables.user._id);
    };
    BaseContentService.prototype.removeVotes = function (id) {
    	return I.$http.put(this.urlBase + '/removevotes/' + id)
    	.then( (response) => I.loginService.bindables.user._id);
    }
    BaseContentService.prototype.delete = function (id) {
        return I.$http.delete(this.urlBase + '/' + id);
    };
//} BaseContentService

import kusema from 'kusema.js';
kusema.service('baseContentService', [BaseContentService]);

export default BaseContentService;
