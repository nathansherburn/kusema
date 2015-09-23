

import angular from 'angular';

import './config.js';
import './common/components/components.js';
import './common/services.js';
import './user/kusemaUser.js';
import './common/directives.js';

import kusema from './kusema.js';

function bootstrap() {
	angular.element(document).ready(function() {
		angular.bootstrap(document, [kusema.name], {strictDi: true});
	});
}

bootstrap();