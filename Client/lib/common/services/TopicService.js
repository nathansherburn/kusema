import BaseJsonService from './BaseJsonService.js'
import {Topic} from 'common/models.js';

var TopicService = function($http, kusemaConfig) {
		this.initCommonDeps($http, kusemaConfig);
		this.urlBase = 'api/topics'
		this.bindables = {
			topics: null,
		}
		this._wait = {};
		this.waitForTopics = new Promise(function(resolve, reject) {
			this._wait.resolve = resolve;
			this._wait.reject = reject;
		}.bind(this));
		this.getAll();
	}

	TopicService.prototype = Object.create(BaseJsonService.prototype, {
		'model': {writable: false, enumerable: false, value: Topic}
	});

	TopicService.prototype.getAll = function() {
		BaseJsonService.prototype.getAll.call(this)
		.then(function(topics) {
			this.bindables.topics = {};
			this.bindables.topicsArray = [];
			for (var topic of topics) {
				this.bindables.topics[topic._id] = topic;
				this.bindables.topicsArray.push(topic);
			}
			this._wait.resolve();
			return this.bindables.topics;
		}.bind(this));
	}

	TopicService.prototype.getTopic = function(topicID) {
		return this.bindables.topics[topicID];
	}

	TopicService.prototype.getTopics = function(topicIDs) {
		return topicIDs.map(this.getTopic.bind(this));
	}

import kusema from 'kusema.js';
kusema.service('topicService', ['$http', 'kusemaConfig', TopicService]);