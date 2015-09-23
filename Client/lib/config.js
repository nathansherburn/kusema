'use strict';

import 'angular';

export default angular.module('kusema.config', [])
  .constant('kusemaConfig', {
    'host': window.location.hostname,
    'port': window.location.port,
    'url': function() { return 'http://'+this.host+':'+this.port+'/'; }
  });
