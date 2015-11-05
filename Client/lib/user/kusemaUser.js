import 'kusema.js';

import './questionList/questionList.js';
import './questionFull/questionFull.js';

import './components/GroupListItem/groupListItem.js';

import template from './kusemaUserTemplate.html';

import {Injector} from 'kusema.js';

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

var I = new Injector('loginService', 'groupService', '$state');

class KusemaUserController {
	constructor($scope, $mdSidenav) {
		I.init();
		this.$mdSidenav = $mdSidenav;
		this.loginData = I.loginService.bindables;
		this.gs = I.groupService;
		this.dummyGroups = {
			'kusema': {
				unitCode: 'Kusema',
				title: 'Your own personal feed'
			},
			'all': {
				unitCode: 'All Questions',
				title: 'Hungry for content?\nView questions from all groups',
				_id: 'all'
			}
		}
	}

	toggle(id) {
		console.log('sup');
		this.$mdSidenav(id).toggle();
	}

	goToGroup(newGroup) {
		if (!newGroup) {
			I.$state.go('user.home');
		}
		I.$state.go('user.group', {groupID: newGroup});
	}

	get currentGroup() {
		if (!I.$state.params.groupID) {
			return this.dummyGroups.kusema;
		} else if (I.$state.params.groupID == 'all') {
			return this.dummyGroups.all
		} else {
			return I.groupService.getGroup(I.$state.params.groupID);
		}
	}

	get knownGroups() {
		var subs;
		if (I.loginService.bindables.user) {
			subs = I.loginService.bindables.user.subscriptions.groups;
		} else {
			subs = [];
		}
		return subs.concat(Object.keys(this.dummyGroups).map((key) => this.dummyGroups[key]));
	}


}

import kusema from 'kusema.js';

export default kusema.addModule('kusema.user', ['ngMaterial'])
	   .config(['$stateProvider', KusemaUserConfig])
	   .directive('kusemaUser', KusemaUserDirective)
	   .controller('kusemaUserController', ['$scope', '$mdSidenav', KusemaUserController]);