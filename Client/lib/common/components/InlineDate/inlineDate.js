'use strict';

import template from './inlineDate.html';

var inlineDateDirective = function() {
		return {
			bindToController: {
				'date': '='
			},
			scope: {},
			template: template,
			controller: 'kusemaInlineDateController',
			controllerAs: 'c',
		};
	};
//}
var inlineDateController = function() {
		return this;
	}
	inlineDateController.prototype.format = function() {
		if (this.date instanceof Date) {
			return this.date.toLocaleString();
		} else {
			return '';
		}
	}

import {addModule} from 'kusema.js';
	
addModule('kusema.components.inlineDate')
		.directive('kusemaInlineDate', inlineDateDirective)
		.controller('kusemaInlineDateController', inlineDateController);