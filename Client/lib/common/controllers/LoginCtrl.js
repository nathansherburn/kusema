'use strict'

var LoginController = function($scope, loginService) {
	$scope.login = loginService.login.bind(loginService)
	$scope.register = loginService.register.bind(loginService);
}

kusema.controller('LoginController', ['$scope', 'loginService', LoginController]);