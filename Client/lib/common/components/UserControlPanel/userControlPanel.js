import template from './userControlPanelTemplate.html';

var UserControlPanelDirective = function() {
	return {
		template: template,
		controller: 'userControlPanelController',
		controllerAs: 'c'
	}
};

var UserControlPanelController = function($css, $scope, loginService) {
	//this thing doesn't actually use a real directive, so the css plugin doesn't work
	// automatically :(
	$css.bind({href: 'common/components/UserControlPanel/userControlPanel.css'}, $scope);

	this.ls = loginService;
	this.allGroups = loginService.bindables.user.subscriptions.groups;
	this.authcateGroups = loginService.bindables.user.authcateSubscriptions.groups;
	this.manualGroups = loginService.bindables.user.manualSubscriptions.groups;
	console.log('bottom sheet controller made');
	return this;
}
UserControlPanelController.prototype = Object.create(Object.prototype);

UserControlPanelController.prototype.showUserControlPanel = function($mdBottomSheet) {
	$mdBottomSheet.show(UserControlPanelDirective());
}

var UserControlPanelConfig = function($rootScope, $mdBottomSheet) {
	console.log('configuring usercp')
	$rootScope.showUserControlPanel = UserControlPanelController.prototype.showUserControlPanel.bind(window, $mdBottomSheet);
}


var GroupListItemDirective = function() {
	return {
		templateUrl: 'common/components/UserControlPanel/groupListItemTemplate.html',
		scope: true,
		replace: true
	}
}

import {addModule} from 'kusema.js';

addModule('components.userControlPanel')
      .directive('kusemaUserControlPanel', UserControlPanelDirective)
      .controller('userControlPanelController', ['$css', '$scope', 'loginService', UserControlPanelController])
      .directive('kusemaGroupListItem', GroupListItemDirective)
      .run(['$rootScope', '$mdBottomSheet', UserControlPanelConfig]);
