import template from './serverMessageTemplate.html';

var serverMessageDirective = function() {
	return {
		scope: {},
		bindToController: {
			'message': '=',
			'messagePrefix': '@'
		},
		template: template,
		controller: 'kusemaServerMessageController',
		controllerAs: 'c',
		css: 'lib/common/components/ServerMessage/serverMessage.css'
	};
}


var serverMessageController = function() {
	this.setMessageProperties();
}

serverMessageController.prototype = Object.create(Object.prototype, {
	'_message': {writable: true, enumerable: false, value: null},
	'message': {
		get: function() {
			return this._message;
		},
		set: function(newMessage) {
			if (newMessage) {
				console.error(newMessage);
				console.error(newMessage.stack);
			}
			this._message = newMessage;
			this.setMessageProperties();
		}
	},
	'messagePrefixBind': {
		get: function() {
			if (this.messagePrefix) {
				return this.messagePrefix + ': ';
			}
		}
	},
	'type': {writable: true, enumerable: false, value: ''},
	'messageText': {writable: true, enumerable: false, value: ''},
});

serverMessageController.prototype.setMessageProperties = function() {
	if (!this.message) {
		console.log('no error');
		delete this.type;
		delete this.messageText;
	} else {
		console.log('showing error');
		this.type = this.message.type || 'error';
		this.messageText = (this.message.data && this.message.data.message)
							|| this.message.data
							|| this.message.message
							|| this.message
							|| 'Server Problem';
	}
}

import {addModule} from 'kusema.js';

addModule('components.serverMessage')
      .directive('kusemaServerMessage', serverMessageDirective)
      .controller('kusemaServerMessageController', serverMessageController);