import 'kusema.js';

import './questionList/questionList.js';
import './questionFull/questionFull.js';
import template from './kusemaUserTemplate.html';

var KusemaUserConfig = function($stateProvider) {
	$stateProvider
		.state('user.home', {
		    url: '',
		    template: '<kusema-question-list></kusema-question-list>'
		})
		.state('user.group', {
		    url: '/group/:groupID',
		    template: '<kusema-question-list group="$root.$stateParams.groupID"></kusema-question-list>'
		})
		.state('user.question', {
			url: '/question/:id',
			template: '<kusema-question-full></kusema-question-full>'
		});
}

var KusemaUserDirective = function() {
	console.log('hello');
	return {
		scope: {
			action: '='
		},
		template: template,
		controller: 'kusemaUserController',
		controllerAs: 'c',
		css: 'lib/user/kusemaUser.css'
	};
};

var KusemaUserController = function($scope, $mdSidenav, loginService) {
	console.log('yo')
	this.$mdSidenav = $mdSidenav;
	$scope.toggle = this.toggle.bind(this);
	$scope.loginData = loginService.bindables;
	console.log($scope.loginData);
	$scope.searchGroups = function() {
		return $scope.loginData.subscriptions.groups;
	}
}
KusemaUserController.prototype = Object.create(Object.prototype);

KusemaUserController.prototype.toggle = function(id) {
	console.log('sup');
	this.$mdSidenav(id).toggle();
}

import kusema from 'kusema.js';

export default kusema.addModule('kusema.user', ['ngMaterial'])
	   .config(['$stateProvider', KusemaUserConfig])
	   .directive('kusemaUser', KusemaUserDirective)
	   .controller('kusemaUserController', ['$scope', '$mdSidenav', 'loginService', KusemaUserController]);