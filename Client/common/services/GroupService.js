var GroupService = function($rootScope, $http, topicService, kusemaConfig) {
		this.initCommonDeps($http, kusemaConfig);
		this.topicService = topicService;
		this.rootScope = $rootScope;
		this.urlBase = 'api/groups'
		this.bindables = {
			groups: null,
			groupsArray: null // there are some places where we need to lookup by key, and others where we need an array :(
		}
		this._wait = {};
		this.waitForGroups = new Promise(function(resolve, reject) {
			this._wait.resolve = resolve;
			this._wait.reject = reject;
		}.bind(this));
		this.getAll();
	}

	GroupService.prototype = Object.create(BaseJsonService.prototype, {
		'model': {writable: false, enumerable: false, value: Group}
	});

	GroupService.prototype.getAll = function() {
		return BaseJsonService.prototype.getAll.call(this)
		.then(this.topicService.waitForTopics)
		.then(function(groups) {
			this.bindables.groups = {};
			this.bindables.groupsArray = [];
			for (var group of groups) {
				this.bindables.groups[group._id] = group;
				this.bindables.groupsArray.push(group);
			}
			this._wait.resolve();
			return this.bindables.groups;
		}.bind(this));
	}

	GroupService.prototype.getGroup = function(groupID) {
		return this.bindables.groups[groupID];
	}

kusema.service('groupService', ['$rootScope', '$http', 'topicService', 'kusemaConfig', GroupService]);