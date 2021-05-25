const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');


// Shows add video page
router.get('/showAddVideo', (req, res) => {
	res.render('video/addVideo');
});


// Adds new video jot from /video/addVideo
router.post('/addVideo', (req, res) => {
	let title = req.body.title;
	let story = req.body.story.slice(0, 100);
	let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
	let language = req.body.language.toString();
	let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
	let classification = req.body.classification;
	let userId = req.user.id;

	// Multi-value components return array of strings or undefined
	Video.create({
		title,
		story,
		classification,
		language,
		subtitles,
		dateRelease,
		userId
	}).then((video) => {
		res.redirect('/video/listVideos'); // redirect to call router.get(/listVideos...) to retrieve all updated
		// videos
	}).catch(err => console.log(err))
});

// List videos belonging to current logged in user
router.get('/listVideos', (req, res) => {
	Video.findAll({
		where: {
			userId: req.user.id
		},
		order: [
			['title', 'ASC']
		],
		raw: true
	}).then((videos) => {
		// pass object to listVideos.handlebar
		res.render('video/listVideos', {
			videos: videos
		});
	}).catch(err => console.log(err));
});
module.exports = router;