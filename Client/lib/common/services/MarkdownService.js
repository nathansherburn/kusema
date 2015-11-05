'use strict';

import hljs from 'highlightjs';
import markdownIt from 'markdown-it';
import markdownItMath from 'markdown-it-math';
import katex from 'katex';
import 'katex/katex.min.css!';

import 'highlightjs/styles/github.css!';

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
				} catch (e) {
					console.log('highlight error');
				}
			} else {
				console.error(language);
				console.error(hljs);
			}
			return '';
		}
		})
	.use(markdownItMath, {
		'inlineOpen': '$$',
		'inlineClose': '$$',
		blockOpen: '$$$',
		blockClose: '$$$',
		renderingOptions: {},
		inlineRenderer: str => katex.renderToString(str, {displayMode: false}),
		blockRenderer: str => katex.renderToString(str, {displayMode: true})
	});
}

import kusema from 'kusema.js';
kusema.factory('markdownService', [MarkdownService]);
