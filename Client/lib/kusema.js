'use strict';

import angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
import 'angular-css';

var kusema = angular.module('kusema', [
'ngMaterial',
'ui.router',
'door3.css',
'kusema.user'
]);

kusema.modules = {};

kusema.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$mdThemingProvider', '$locationProvider', function (
                $stateProvider,
                $urlRouterProvider,
                $httpProvider,
                $mdThemingProvider,
                $locationProvider
              ) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('pink')

  $httpProvider.defaults.withCredentials = true;

  $locationProvider.html5Mode(true);
  /* Direct unmatched urls */
  /*$stateProvider.otherwise({
    templateUrl: '404.html',
  });*/

  /* Direct urls */
  $stateProvider
    .state('user', {
      template: '<kusema-user></kusema-user>',
      abstract: true,
      url: '/kusema'
    });

  $urlRouterProvider
    .when('','/kusema')
    .when('/','/kusema')
    .when('/index.html','/kusema');


}]);

kusema.run(['$rootScope', '$stateParams', function($rootScope, $stateParams) {
  $rootScope.$stateParams = $stateParams;
  console.log('hellooooo! :)');
}]);

/*
kusema.addModule(string moduleName, dependencies=[], autoRequire=true)

 adds a module by name and by property, and automatically makes
 kusema require it.
 kusema.addModule('components');
 => kusema.modules.components = angular.module('kusema.components', []);
    kusema.requires.push('kusema.components');

  if you don't want to automatically have this module's parents require it,
  call with autoRequire set to false.

  module is always assumed to be a child of kusema, so
  addModule('kusema.components') has exactly the same effect as
  addModule('components') .

  This used to do some fanciness to create a tree structure of modules
  For various reasons that is a PITA with systemjs/jspm, so now everthing
  just gets added flatly under kusema.modules.
*/
var addModule = function (moduleName, dependencies, autoRequire) {
  if (dependencies === undefined) {
    dependencies = [];
  }
  if (autoRequire === undefined) {
    autoRequire = true;
  }
  if (typeof(moduleName) != "string") {
    throw new TypeError("moduleName must be a string, e.g. \"components.magic\"");
  }
  var splitName = moduleName.split(".");
  var parentChain = splitName.slice(0,-1);
  var moduleBaseName = splitName[splitName.length-1];
  var moduleNameNoPrefix;

  // remove 'kusema.' from start of module names
  if (parentChain.length > 0 && parentChain[0] == "kusema") {
    parentChain = parentChain.slice(1);
    moduleNameNoPrefix = splitName.slice(1).join('.');
  } else {
    moduleName = 'kusema.'+moduleName;
    moduleNameNoPrefix = moduleName
  }

  var module = angular.module(moduleName, dependencies);
  kusema.modules[moduleNameNoPrefix] = module;
  if (autoRequire) {
    kusema.requires.push(moduleName);
  }

  return module;
}

class Injector {
  constructor(...injectables) {
    this._injectables = injectables;
    this._initialized = false;
  }

  init() {
    if (!this._initialized) {
      this._i = angular.element(document.body).injector();
      this.inject(...this._injectables);
      this._initialized = true;
    }
  }

  inject(...injectables) {
    for (let injectable of injectables) {
      this[injectable] = this._i.get(injectable);
    }
  }
}

kusema.addModule = addModule;
export {addModule, Injector};

var relativeTemplates


export default kusema;

[1,2,3,4,5].map((n) => `this is ${n} times cooler than before!`).map(console.log.bind(console))