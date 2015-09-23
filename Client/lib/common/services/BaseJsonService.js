'use strict';

import {BaseJson} from 'common/models.js';

var BaseJsonService = function($http, kusemaConfig) {
		this.initCommonDeps($http, kusemaConfig);
		this.serverURL = kusemaConfig.url();
		return this;
	}

	BaseJsonService.prototype = Object.create(Object.prototype, {
		serverURL: {writable: true, enumerable: false, value: ''},
		_urlStem: {writable: true, enumerable: false, value: ''},
		urlBase: {
			get: function() {
				return this.serverURL+this._urlStem
			},
			set: function(urlStem) {
				this._urlStem = urlStem;
			}
		},
		model: {writable: false, enumerable: false, value: BaseJson}
	});

	BaseJsonService.prototype.initCommonDeps = function($http, kusemaConfig) {
			this.$http = $http;
			this.kusemaConfig = kusemaConfig
	}
	BaseJsonService.prototype.createClientModel = function(responseJSON) {
	    return new this.model(responseJSON, this);
	}
	BaseJsonService.prototype.modelFromResponse = function(response) {
		return this.createClientModel(response.data);
	}
    BaseJsonService.prototype.get = function (id) {
        return this.$http.get(this.urlBase + '/' + id)
        		   .then(this.modelFromResponse.bind(this));
    };
    BaseJsonService.prototype.createClientModels = function(responseJSON) {
        return responseJSON.map(this.createClientModel.bind(this));
    }
    // this gets passed as a parameter to JSON.stringify; its function is to replace
    // any submodels in our main model with just their _ids.
    BaseJsonService.prototype.sanitizeJson = function(key, value) {
    	if (key === '') {
    		// we always want to continue to recurse into our main object, else
    		// it'll get caught in the next bit and truncated to just its ID!
    		return value;
    	} else if (value && value._id) {
    		return value._id;
    	} else {
    		return value;
    	}
    }
    BaseJsonService.prototype.getAll = function () {
        return this.$http.get(this.urlBase)
        		   .then(function(response) {
        		   		return response.data.map(this.createClientModel.bind(this));
        		   }.bind(this));
    };

import kusema from 'kusema.js';
kusema.service('baseJsonService', ['$http', 'kusemaConfig', BaseJsonService]);

export default BaseJsonService;