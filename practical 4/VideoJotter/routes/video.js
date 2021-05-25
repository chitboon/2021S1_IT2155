const express = require('express');
const router = express.Router();


// List videos belonging to current logged in user
router.get('/listVideos',  (req, res) => {
	res.render('video/listVideos', { // pass object to listVideos.handlebar
		videos: 'List of videos'
	});

});
module.exports = router;