'use strict';

var kusema = angular.module('kusema', [
'ngAnimate',
'ngMaterial',
'ngRoute',
'kusema.config'
]);

kusema.config(function($routeProvider, $httpProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('pink')

  $httpProvider.defaults.withCredentials = true;

  /* Direct unmatched urls */
  $routeProvider.otherwise({
    templateUrl: '404.html',
  });

  /* Direct urls */
  $routeProvider
  .when('/', {
    templateUrl: 'user/home/home.html'
  })
  .when('/question/:id', {
    templateUrl: 'user/question/question.html',
  })
  .when('/group/:id', {
    templateUrl: 'user/group/group.html',
  })
  .when('/newcomment/:id', {
	  templateUrl: 'views/newComment.html',
  })
  .when('/newquestion/', {
	  templateUrl: 'views/newQuestion.html',
  })
  .when('/newunit/', {
	  templateUrl: 'views/newUnit.html',
  })
  .when('/newarea/', {
	  templateUrl: 'views/newArea.html',
  });
  
});

