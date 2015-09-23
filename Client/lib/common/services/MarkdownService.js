'use strict';

import hljs from 'highlightjs';
import markdownIt from 'markdown-it';

var MarkdownService = function() {
	console.log('markdown');
	return markdownIt({
		'html': false,
		'linkify': true,
		'breaks': true,
		'highlight': function(code, language) {
			if (language && hljs.getLanguage(language)) {
				try {
					console.log('highlighting');
					return hljs.highlight(language, code).value;
				} catch (e) {}
			}
			return '';
		}
		});
}

import kusema from 'kusema.js';
kusema.factory('markdownService', [MarkdownService]);
