import userMenuTemplate from './userMenuTemplate.html';

var userMenuDirective = function() {
		return {
			template: userMenuTemplate,
			controller: 'kusemaUserMenuController',
			controllerAs: 'c'
		};
	};
//}
var userMenuController = function($scope, $timeout, $mdMenu, $q, loginService) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$mdMenu = $mdMenu;
		this.$q = $q;
		this.originalEvent = null;
		this.loginService = loginService;
		this.loginData = loginService.bindables;
		return this;
	}

	userMenuController.prototype.openMenu = function(openMenuFunction, event) {
		this.originalEvent = event;
		openMenuFunction(event);
		this.loginMessage = null;
		this.$timeout(function() { 
			// we need to do this instead of ngClick because if we can't cancel
			// the event, we can't stop the menu closing.
			if (!this.listenerAdded) {
				document.getElementById('loginButton').addEventListener('click', this.clickLogin.bind(this), true)
				this.listenerAdded = true;
			}
		}.bind(this));
	}
	userMenuController.prototype.loginMonash = function() {
		this.loginService.loginMonash();
	}
	userMenuController.prototype.clickLogin = function(event) {
		console.log('clicked Login');
		event.stopPropagation();
		this.loginMessage = null;
		this.login()
		.then( function() {
			this.$mdMenu.hide();
		}.bind(this));
	}
	userMenuController.prototype.login = function() {
		console.log('login');
		return this.loginService.login(this.data.username, this.data.password)
		.catch(function(e) {
			console.log('caught');
			this.loginMessage = e;
			return this.$q.reject(e);
		}.bind(this));
	}
	userMenuController.prototype.register = function() {
		console.log('register');
		this.loginService.register(this.data.username, this.data.password)
		.then(function(registration) {
			this.loginService.login(this.data.username, this.data.password);
		}.bind(this));
	}
	userMenuController.prototype.logout = function() {
		console.log('logout');
		this.loginService.logout();
	}

import notLoggedInTemplate from './notLoggedInTemplate.html';
var userMenuNotLoggedInDirective = function() {
	return {
		scope: true,
		template: notLoggedInTemplate
	};
};

import loggedInTemplate from './loggedInTemplate.html';
var userMenuLoggedInDirective = function() {
	return {
		scope: true,
		template: loggedInTemplate
	}
}

import {addModule} from 'kusema.js';
addModule('kusema.components.userMenu')
		.directive('kusemaUserMenu', userMenuDirective)
		.controller('kusemaUserMenuController', ['$scope', '$timeout', '$mdMenu', '$q', 'loginService', userMenuController])
		.directive('kusemaUserMenuNotLoggedIn', userMenuNotLoggedInDirective)
		.directive('kusemaUserMenuLoggedIn', userMenuLoggedInDirective);
