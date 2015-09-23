console.log('hello');
var userDataEncoded = decodeURIComponent(window.location.search.substring(1));
try {
	var userData = JSON.parse(userDataEncoded);
	var message = {'monashLoginComplete': userData};
	if (window.opener) {
		console.log('sent back message');
		window.opener.postMessage(message, window.location.origin);
	} else {
		window.alert('Monash login probably worked, but your browser stopped me talking to the main Kusema site! Close this window and refresh the tab with Kusema. :)');
		window.close();
	}
} catch (e) {
	console.error(userDataEncoded);
}