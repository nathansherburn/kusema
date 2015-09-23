import template from './questionPreviewTemplate.html';

var questionPreviewDirective = function() {
		return {
			scope: {
				'question': '='
			},
			template: template,
			controller: 'kusemaQuestionPreviewController',
			controllerAs: 'c',
			css: 'lib/common/components/QuestionPreview/questionPreview.css'
		};
	};
//}
var questionPreviewController = function($scope) {
		this.$scope = $scope;
		this.question = $scope.question;
		$scope.$watch('question.group', this.updateGrossHackyList.bind(this));
		$scope.$watch('question.topics', this.updateGrossHackyList.bind(this));
		this.updateGrossHackyList();
		return this;
	}

	questionPreviewController.prototype = Object.create(Object.prototype, {});

	questionPreviewController.prototype.updateGrossHackyList = function() {
		this.groupsAndTopics = [this.question.group].concat(this.question.topics);
	}

import {addModule} from 'kusema.js';

addModule('kusema.components.questionPreview')
		.directive('kusemaQuestionPreview', questionPreviewDirective)
		.controller('kusemaQuestionPreviewController', ['$scope', questionPreviewController]);