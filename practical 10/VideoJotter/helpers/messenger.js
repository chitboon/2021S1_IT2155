
const flashMessage = (res, messageType, message, icon, dismissable) => {
	let alert;
	switch(messageType) {
		case 'success':
			alert = res.flashMessenger.success(message);
			break;
		case 'error':
			alert = res.flashMessenger.error(message);
			break;
		case 'info':
			alert = res.flashMessenger.info(message);
			break;
		case 'danger':
			alert = res.flashMessenger.danger(message);
			break;
		default:
			alert = res.flashMessenger.info(message);
	}
	alert.titleIcon = icon;
	alert.canBeDismissed = dismissable;
};

module.exports = flashMessage; 		// returns a function
/*
* const alertMessage = require('..../messenger')
* alertMessage(res, 'info', 'message', icon, true
* */

// module.exports = { flashMessage }; // returns and object instead of a function
/*
* const alertMessage = require('.../messenger')
* alertMessage.flashMessage(...)	 // Calls object using dot notation
* */