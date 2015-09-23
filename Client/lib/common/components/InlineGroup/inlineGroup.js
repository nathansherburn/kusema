'use strict';

import template from './inlineGroup.html';

var inlineGroupDirective = function() {
		return {
			bindToController: {
				'group': '='
			},
			scope: {},
			template: template,
			controller: 'kusemaInlineGroupController',
			controllerAs: 'c',
		};
	};
//}
var inlineGroupController = function() {
		return this;
	}

import {addModule} from 'kusema.js';

addModule('kusema.components.inlineGroup')
		.directive('kusemaInlineGroup', inlineGroupDirective)
		.controller('kusemaInlineGroupController', inlineGroupController);