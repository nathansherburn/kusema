'use strict';

import * as models from 'common/models.js';
import template from './contentCardTemplate.html';

var contentCardDirective = function() {
		return {
			bindToController: {
				'content': '=',
				'mode': '@',
				'onSubmit': '&'
			},
			scope: {
				'contentType': '@'
			},
			template: template,
			css: 'lib/common/components/ContentCard/contentCard.css',
			controller: 'kusemaContentCardController',
			controllerAs: 'c',
		};
	};
//}
var contentCardController = function($scope, $timeout, commentFactory, loginService, socketService) {
		this.loginData = loginService.bindables;
		this.commentFactory = commentFactory;
		this.socketService = socketService;
		this.$timeout = $timeout;
		this.$scope = $scope;
		this.subscription = null;
		this.updateSubscription();
		this.mode = this.modes.VIEW;
		$scope.$on('$destroy', this.destroy.bind(this));

		return this;
	}
	contentCardController.prototype = Object.create(Object.prototype, {
		'content': {
			get: function() {return this._content},
			set: function(newContent) {
				this._content = newContent;
				this.updateSubscription();
			}
		},
		'mode': {
			get: function() {return this._mode},
			set: function(newMode) {
				this._mode = (newMode) ? newMode : this.modes.VIEW;
			}
		},
		'userHasUpvoted': {
			get: function() {
				try {
					return (this.content instanceof models.BaseContent 
							&& this.loginData.user
							&& this.content.upVotes.has(this.loginData.user._id));
				} catch (e) {
					console.error(this.content);
				}
			}
		},
		'userHasDownvoted': {
			get: function() {
					return (this.content instanceof models.BaseContent 
							&& this.loginData.user
							&& this.content.downVotes.has(this.loginData.user._id));}
			}
	});
	contentCardController.prototype.modes = {VIEW: "view", CREATE: "create", EDIT: "edit"};
	contentCardController.prototype.commentsChanged = function(newComments) {
		console.log(newComments);
		console.log('got new comments');
		this.$scope.$apply(function() {
			this.content.comments = newComments;
		}.bind(this));
	}
	contentCardController.prototype.updateSubscription = function() {
		if (this.content instanceof models.BaseContent) {
			if (this.subscription) this.subscription.cancel();
			if (this.commentFactory) {
				this.subscription = this.commentFactory.subscribeTo(this.content, this.commentsChanged.bind(this));
			}
		}
	}
	contentCardController.prototype.destroy = function() {
		this.socketService.unwatchContent(this.content);
	}
	contentCardController.prototype.editContent = function() {
		this.mode = this.modes.EDIT;
	}
	contentCardController.prototype.finishEditingContent = function() {
		this.mode = this.modes.VIEW;
	}
	contentCardController.prototype.editingSubmitted = function(newContent) {
		this.finishEditingContent();
	}
	contentCardController.prototype.creatingSubmitted = function(newContent) {
		this.finishEditingContent();
		this.content = newContent;
		if (this.onSubmit) {
			console.log('calling back!');
			this.onSubmit({'newContent': newContent});
		}
	}
	contentCardController.prototype.writeComment = function() {
		this.writingComment = true;
	}
	contentCardController.prototype.finishedWritingComment = function() {
		this.writingComment = false;
	}
	contentCardController.prototype.upvoteClicked = function() {
		return (this.userHasUpvoted) ? this.content.removeVotes() : this.content.upVote();
	}
	contentCardController.prototype.downvoteClicked = function() {
		return (this.userHasDownvoted) ? this.content.removeVotes() : this.content.downVote();
	}

import commentTemplate from './contentCardCommentTemplate.html';
var contentCardCommentDirective = function() {
	return {
		bindToController: {
			'comment': '=',
			'parentId': '=',
			'mode': '@',
			'onFinishedEditing': '&'
		},
		scope: {},
		template: commentTemplate,
		controller: 'kusemaContentCardCommentController',
		controllerAs: 'c',
	}
}

var contentCardCommentController = function(commentService, loginService) {
		this.submittingComment = false;
		this.newComment = ""
		this.commentService = commentService;
		this.loginData = loginService.bindables;
	}
	contentCardCommentController.prototype = Object.create(Object.prototype, {
		mode: {writable: true, value: "view"},
		viewMode: {
			get: function() {
				switch (this.mode) {
					case "create":
					case "edit":
						return "edit";
						break;
					case "view":
					default:
						return "view";
						break;
				}
			}
		},
		submitComment: {
			get: function() {
			console.log('posting');
				switch (this.mode) {
					case "create":
						return this.createComment;
					case "edit":
						return this.editComment;
					default:
						return function() {};
				}
			}
		}
	})
	contentCardCommentController.prototype.startCreating = function() {
		this.mode = "create";
	}
	contentCardCommentController.prototype.startEditing = function() {
		this.mode = "edit";
		this.newComment = this.comment.message;
	}
	contentCardCommentController.prototype.createComment = function() {
		this.submittingComment = true;
		this.commentService.add({parent: this.parentId, message: this.newComment}).then(
			function(response) {
				this.submittingComment = false;
				this.stopEditing();
				//if we've just created a comment, we are a create form and should be reset
				this.mode = "create";
				this.newComment = "";
			}.bind(this)
		);
	}
	contentCardCommentController.prototype.editComment = function() {
		this.submittingComment = true;
		this.commentService.update(this.comment._id, {parent: this.parentId, message: this.newComment}).then(
			function(response) {
				this.submittingComment = false;
				this.stopEditing();
			}.bind(this)
		);
	}
	contentCardCommentController.prototype.deleteComment = function() {
		this.submittingComment = true;
		this.commentService.delete(this.comment._id).then(
			function(response) {
				this.submittingComment = false;
				this.stopEditing();
			}.bind(this)
		);
	}
	contentCardCommentController.prototype.stopEditing = function() {
		this.newCommment = "";
		this.mode = "view";
		if (this.onFinishedEditing) {
			this.onFinishedEditing();
		}
	}

import {addModule} from 'kusema.js';

addModule('kusema.components.contentCard')
		.directive('kusemaContentCard', contentCardDirective)
		.controller('kusemaContentCardController', ['$scope', '$timeout', 'commentService', 'loginService', 'socketFactory', contentCardController]);

addModule('kusema.components.contentCard.comment')
      .directive('kusemaContentCardComment', contentCardCommentDirective)
      .controller('kusemaContentCardCommentController', ['commentService', 'loginService', contentCardCommentController]);