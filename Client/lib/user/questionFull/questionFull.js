'use strict';
import questionFullTemplate from './questionFullTemplate.html';
var QuestionFullDirective = function() {
	return {
		scope: {},
		template: questionFullTemplate,
		controller: 'questionFullController',
		controllerAs: 'c'
	};
};

var QuestionFullController = function($scope, $timeout, $stateParams, questionFactory, commentFactory) {

		this.$scope = $scope;

		this.id = $stateParams.id;
		this.question = $scope.question;

		this.editingQuestion;
		this.questionFactory = questionFactory;
		this.commentFactory = commentFactory;

		this.questionEditorOpen = false;
		this.questionEditorSubmitted = false;

		this.questionFactory.get(this.id)
			.then(function(question) {
					$timeout(function() {
						this.question = question;
						this.newAnswer = {'__t': 'Answer', 'question': this.question};
					}.bind(this), 0);
			}.bind(this));
	}

//} QuestionController

import {addModule} from 'kusema.js';

addModule('kusema.user.questionFull')
      .directive('kusemaQuestionFull', QuestionFullDirective)
	  .controller('questionFullController', ['$scope', '$timeout', '$stateParams', 'questionService', 'commentService', QuestionFullController]);


/*
var CommentController = function($routeParams, loginService, commentFactory) {

		this.loginService = loginService;
		this.commentFactory = commentFactory;
		this.questionId = $routeParams.id
		this.comments = []
		this.commentFormOpen = false;
		this.newComment = null;
		commentFactory.getComments(this.questionId)
			.success(function(comments) {
				//TODO: this logic should be in commentFactory, but it's complicated to handle promises
				this.comments = comments.map(function(c) {return commentFactory.createComment(c);});
			}.bind(this));
		this.initializeNewCommentForm();

	}
	CommentController.prototype.initializeNewCommentForm = function() {
		this.newComment = {
			'question_id': this.id,
			'author': this.loginService.username,
			'message': ''
		};
	}
	CommentController.prototype.addComment = function() {
		this.commentFactory.addComment(this.questionId, this.newComment);
		this.comments.concat(this.newComment); //TODO: push message from server
		this.initializeNewCommentForm();
	}
	CommentController.prototype.toggleWriter = function() {
		this.commentFormOpen = !this.commentFormOpen;
	}
kusema.controller('CommentController', ['$routeParams', 'loginService', 'commentFactory', CommentController]);
*/

/*

kusema

.controller(
		'QuestionController',
		[ '$scope', '$routeParams', '$timeout', 'questionFactory', 'commentFactory',
				'toolboxFactory', function($scope, $routeParams, $timeout, questionFactory, commentFactory, toolboxFactory) {
					var tmp = {};
					tmp.me = this;
					this.questionId = $routeParams.id;
					tmp.me.questionEditorOpen = false;
					tmp.me.button = {'text': 'Edit', 'class': 'btn btn-success', 'disabled': false};
					
					questionFactory.getQuestionById($routeParams.id)
						.success(function(data) {
							tmp.me.question = data;
							tmp.me.questionForm = {'title': data.title, 'message': data.message};
						})
						.error(function(error) {
							console.log('Invalid question ID passed in (id=' + routeParams.id + '): '+ error.message);
							alert('Invalid question ID passed in (id=' + routeParams.id + '): '+ error.message);
						});
					
					tmp.me.editQuestion = function() {
						if(tmp.me.questionForm.title !== tmp.me.question.title || tmp.me.questionForm.message !== tmp.me.question.message) {
							tmp.me.button.disabled = true;
							tmp.me.button.text = 'loading ...';
							questionFactory.updateQuestion(tmp.me.questionForm)
								.success(function(data) {
									tmp.me.button.disabled = false;
									tmp.me.button.text = 'Edit';
									tmp.me.question.title = tmp.me.questionForm.title;
									tmp.me.question.message = tmp.me.questionForm.message;
								})
								.error(function(error) {
									console.debug('Error saving question (id=' + $routeParams.id + '). ' + error.message);
									alert('Error saving question (id=' + $routeParams.id + '). ' + error.message);
								});
						}
					};
} ])

.controller(
		'CommentController',
		[ '$scope', '$routeParams', '$timeout', 'questionFactory', 'commentFactory', 'socketFactory', 'toolboxFactory', 
		  function($scope, $routeParams, $timeout, questionFactory, commentFactory, socketFactory, toolboxFactory) {
				var tmp = {};
				tmp.me = this;
				tmp.me.comments = [];
				tmp.me.messagerOpen = false;
				tmp.me.newComment = '';
				
				commentFactory.getComments($routeParams.id)
					.success(function(data) {
						tmp.me.comments = data;
					})
					.error(function(error) {
						console.log('Unable to load comments: '+ error.message);
						alert('Unable to load comments: '+ error.message);
					});
				
				tmp.me.deleteComment = function(id) {
			    	tmp.search = toolboxFactory.findObjectInArray(tmp.me.comments, '_id', id);
			    	if(tmp.search.objectPosition !== -1) {
			    		tmp.me.comments.splice(tmp.search.objectPosition, 1);
			    		commentFactory.deleteComment(id);
			    	} else {alert('Invalid Comment. (id: ' + id + ')')}
			    }
				

			    tmp.me.closeWriter = function () {
			    	tmp.me.messagerOpen = false;
			        $('.messager').animate({bottom:'-145px'}, 200);
			        $('.contribute').animate({bottom:'55px', right:'90px', opacity: 1}, 200);
			        $('#cross').css({'-webkit-transform' : 'rotate('+ 0 +'deg)',
			         '-moz-transform' : 'rotate('+ 0 +'deg)',
			         '-ms-transform' : 'rotate('+ 0 +'deg)',
			         'transform' : 'rotate('+ 0 +'deg)'});
			    };

			    tmp.me.openWriter = function () {
			    	tmp.me.messagerOpen = true;
			        $('.messager').animate({bottom:'0px'}, 200);
			        $('.contribute').animate({bottom:'155px', right:'50%', opacity: 1}, 200);
			        $('#cross').css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
			         '-moz-transform' : 'rotate('+ 45 +'deg)',
			         '-ms-transform' : 'rotate('+ 45 +'deg)',
			         'transform' : 'rotate('+ 45 +'deg)'});
			    };
			    
			    tmp.me.addComment = function () {
			        if (tmp.me.newComment !== '') {
			          // Save comment to database
			          var message = {
			            question_id: $routeParams.id,
			            author: 'sherbinator2014 ',
			            message: tmp.me.newComment
			          };
			          $('html, body').animate({scrollTop:$(document).height() - 1}, 'slow');
			          commentFactory.addComment($routeParams.id, message);
			          socketFactory.emit('message sent', message);
			          tmp.me.comments = tmp.me.comments.concat(message);
			          tmp.me.newComment = '';
			          tmp.me.closeWriter();
			        }
			      };
} ])
;
*/