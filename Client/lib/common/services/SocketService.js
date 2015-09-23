'use strict';

import io from 'socket.io-client';

function contentId(content) {
  var id = '';
  if (!content) {
    id = null;
  } else if (content._id) {
    id = content._id;
  } else {
    id = content;
  }
  return {'contentId': id};
}

function socketService(kusemaConfig) {
  this.kusemaConfig = kusemaConfig;

  var socket = io.connect(kusemaConfig.url());
  console.log('socketService called');

  socket.watchContent = function(content) {
    console.log('watching');
    return this.emit('watchContent', contentId(content));
  }
  socket.unwatchContent = function(content) {
    console.log('unwatching');
    return this.emit('unwatchContent', contentId(content));
  }

  return socket;
}

import kusema from 'kusema.js';
kusema.factory('socketFactory', ['kusemaConfig', socketService]);
