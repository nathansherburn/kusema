import template from './groupListItemTemplate.html';

function groupListItemDirective() {
	return {
		scope: true,
		template: template,
		link: function(scope, element, attrs) {
			attrs.$observe('group', function(newGroup, oldGroup) {
				scope.group = scope.$eval(newGroup);
			})
		}
	};
}

import kusema from 'kusema.js';

kusema.addModule('kusema.user.groupListItem')
	  .directive('groupListItem', groupListItemDirective);