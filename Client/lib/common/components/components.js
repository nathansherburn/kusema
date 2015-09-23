
// pre-systemjs, I had each component in its own angular module,
// organized in a tree based on simple properties (so the module
// named 'kusema.components.contentCard' would actually be accessible
// in js at kusema.components.contentCard. )
// this causes a problem with systemjs as importing is done before
// code is run, meaning the tree suddenly gets a lot harder to build
// For now, I am hacking around this by chucking away separate modules
// for components, so directives and controllers now get added to the
// kusema module directly. this is probably OK for the foreseeable
// future.
//
// In case we ever need to go back to strict modules-per-component,
// this commented bit is what is needed to get this to work with
// systemJS. However, it breaks bundling (I think bundling just searches
// for 'import' statements in the code, which the below abomination lacks)
// so work would still  be needed.
/*
import kusema from 'kusema';
export default System.import('kusema').then( function(kusema) {
	kusema.addModule('kusema.components', [], false);

	console.log('components module made');
	return Promise.all([
		'./ContentCard/contentCard',
		'./EditContentForm/editContentForm',
		'./InlineDate/inlineDate',
		'./InlineGroup/inlineGroup',
		'./Markdown/markdown',
		'./QuestionPreview/questionPreview',
		'./ServerMessage/serverMessage',
		'./UserControlPanel/userControlPanel',
		'./UserMenu/userMenu'
	].map( (name) => System.import('common/components/'+name)) );


}).then(function () {
	console.log('components imported');
})
*/

// and here is the current implementation that breaks with separate modules

import kusema from 'kusema.js';

import './ContentCard/contentCard.js';
import './EditContentForm/editContentForm.js';
import './InlineDate/inlineDate.js';
import './InlineGroup/inlineGroup.js';
import './Markdown/markdown.js';
import './QuestionPreview/questionPreview.js';
import './ServerMessage/serverMessage.js';
import './UserControlPanel/userControlPanel.js';
import './UserMenu/userMenu.js';