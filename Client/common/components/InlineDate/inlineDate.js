'use strict';

var inlineDateDirective = function() {
		return {
			bindToController: {
				'date': '='
			},
			scope: {},
			templateUrl: 'common/components/InlineDate/inlineDate.html',
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

import {addModule} from 'kusema';
	
addModule('kusema.components.inlineDate')
		.directive('kusemaInlineDate', inlineDateDirective)
		.controller('kusemaInlineDateController', inlineDateController);