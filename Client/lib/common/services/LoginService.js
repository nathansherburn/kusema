'use strict';

var LoginService = function($http, $rootScope, $q, groupService, kusemaConfig) {
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.$q = $q;
		this.kusemaConfig = kusemaConfig;
		this.groupService = groupService;
		this.bindables = {
			loginState: 0,
			user: null,
		};
		this.checkLogin();
		return this;
	}
	LoginService.prototype = Object.create(Object.prototype, {
		kusemaConfig: {value: null, writable: true},
	});
	LoginService.prototype.loginMonash = function() {
		return new Promise(function(resolve, reject) {
			this.casPopup = window.open('/account/login_monash', 'loginPopup', 'width=400', 'height=400');
			var loginMonashCallback = function(messageEvent) {
				if (messageEvent.origin !== window.location.origin) {
					console.error('event origin'+event.origin+' was not the same as this page: '+window.location.origin);
					reject();
				} else {
					console.log('monash login probably all good!');
					this.casPopup.close();
					this.checkLogin().then(resolve, reject);
				}
			}.bind(this);
			window.addEventListener('message', loginMonashCallback, false);
		}.bind(this));
	}
	LoginService.prototype.loginMonashComplete = function(messageEvent) {
	}
	LoginService.prototype.register = function(username, password) {
		var registerRequest = this.$http.post(this.kusemaConfig.url()+'account/register_local', {'username': username, 'password': password})
		return registerRequest.then(
			function(response) {
				console.log('register request done');
			},
			function(error) {
				console.log('register error');
			}
		);
	};
	LoginService.prototype.login = function(username, password) {
		this.bindables.loginState = -1;
		return this.$http.post(
							this.kusemaConfig.url()+'account/login_local',
							{'username': username, 'password': password}
						)
						.then( function(response) {
							console.log('logged in as '+response.data.username);
							return this.checkLogin();
						}.bind(this))
						.catch( function(error) {
							this.bindables.loginState = 0;
							return this.$q.reject(error);
						}.bind(this));
	};
	LoginService.prototype.logout = function() {
		var logoutRequest = this.$http.post(this.kusemaConfig.url()+'account/logout');
		this.bindables.loginState = -2;
		return logoutRequest.then(
			function(response) {
				return this.checkLogin();
			}.bind(this),
			function(error) {
				console.error('logout error'+error.message);
			}.bind(this)
		);
	}
	LoginService.prototype.isLoggedIn = function() {
		return this.loggedIn;
	}
	LoginService.prototype.checkLogin = function() {
		var checkRequest = this.$http.get(this.kusemaConfig.url()+'account/is_logged_in');
		return checkRequest.then(function(response) {
			if (response.data) {
				this.bindables.loginState = 1;
			} else {
				this.bindables.loginState = 0;
			}
			console.log(this.bindables);
			return this.populateUser(response.data);
		}.bind(this) )
		.then( function(user) {
			console.log('wat');
			console.log(this.bindables);
			this.$rootScope.$broadcast('loginChanged');
		}.bind(this) );
	}
	LoginService.prototype.populateUser = function(userData) {
		var user = userData;
		console.log('yay?');

		return this.groupService.waitForGroups
		.then( function() {
			if (!user) {
				return;
			}
			for (var subscriptions of [user.subscriptions, user.authcateSubscriptions, user.manualSubscriptions]) {
				subscriptions.groups = (subscriptions.groups)
									 ? this.groupService.getGroups(subscriptions.groups)
									 : [];
				subscriptions.topics = (subscriptions.topics)
								     ? this.groupService.getTopics(subscriptions.topics)
								     : [];
			}
		}.bind(this) )
		.catch( function(e) {
			console.error(e);
			console.error(e.stack);
		})
		.then( function() {
			this.bindables.user = user;
			return user;
		}.bind(this) );
	}
//} loginService

import kusema from 'kusema.js';
kusema.service('loginService', ['$http', '$rootScope', '$q', 'groupService', 'kusemaConfig', LoginService]);

export default LoginService;