'use strict';

var needsLoginDirective = function() {
	var linkFunction = function(scope, element, attributes) {
		scope.c.needsLogin = !(attributes['kusemaNeedsLogin']=="false");
		scope.c.element = element;
	};
	return {
		bindToController: {
			needsUserId: '=',
		},
		scope: {},
		restrict: 'A',
		replace: false,
		link: linkFunction,
		controller: 'needsLoginController',
		controllerAs: 'c',
		priority: 1
	};
}

var needsLoginController = function($scope, loginService) {
		this.loginData = loginService.bindables;
		$scope.$on('loginChanged', this.check.bind(this));
		this.check();
	}
	needsLoginController.prototype = Object.create(Object.prototype, {
		'element': {writable: true, enumerable: false, value: null},
		'needsLogin': {writable: true, enumerable: false, value: true},
		'needsUserId': {
			get: function() {
				return this._needsUser;
			},
			set: function(newUser) {
				if (newUser && newUser._id) {
					this._needsUser = newUser._id;
				} else {
					this._needsUser = newUser;
				}
				this.check();
			}
		}
	});
	needsLoginController.prototype.check = function() {
		console.log('checking');
		if (!this.element) {
			return;
		}
		if (this.shouldBeShown()) {
			this.element.removeClass('ng-hide');
		} else {
			this.element.addClass('ng-hide');
		}
	};
	needsLoginController.prototype.shouldBeShown = function() {
		var userResult = true;
		if (this.needsUserId) {
			userResult = (this.loginData.user && (this.loginData.user._id == this.needsUserId));
		}
		var loginResult = (this.needsLogin == (this.loginData.loginState == 1));
		return loginResult && userResult;
	}

kusema.user.directive('kusemaNeedsLogin', needsLoginDirective)
		   .controller('needsLoginController', ['$scope', 'loginService', needsLoginController]);