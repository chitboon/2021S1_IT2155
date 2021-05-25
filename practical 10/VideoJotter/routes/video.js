const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');
// Flash Messegner
const alertMessage = require('../helpers/messenger');

const ensureAuthenticated = require('../helpers/auth');

// Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');


// Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/' + req.user.id)){
		fs.mkdirSync('./public/uploads/' + req.user.id);
	}
	
	upload(req, res, (err) => {
		if (err) {
			res.json({file: '/img/no-image.jpg', err: err});
		} else {
			if (req.file === undefined) {
				res.json({file: '/img/no-image.jpg', err: err});
			} else {
				res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
			}
		}
	});
})

// Shows add video page
router.get('/showAddVideo', ensureAuthenticated, (req, res) => {
	res.render('video/addVideo');
});

// Shows edit video page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Video.findOne({
		where: {
			id: req.params.id
		}
	}).then((video) => {
		if (!video) { // check video first because it could be null.
			alertMessage(res, 'info', 'No such video', 'fas fa-exclamation-circle', true);
			res.redirect('/video/listVideos');
		} else {
			// Only authorised user who is owner of video can edit it
			if (req.user.id === video.userId) {
				checkOptions(video);
				res.render('video/editVideo', { // call views/video/editVideo.handlebar to render the edit video page
					video
				});
			} else {
				alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
				res.redirect('/logout');
			}
		}
	}).catch(err => console.log(err)); // To catch no video ID
});

function checkOptions(video){
	video.chineseLang = (video.language.search('Chinese') >= 0) ? 'checked' : '';
	video.englishLang = (video.language.search('English') >= 0) ? 'checked' : '';
	video.malayLang = (video.language.search('Malay') >= 0) ? 'checked' : '';
	video.tamilLang = (video.language.search('Tamil') >= 0) ? 'checked' : '';
	
	video.chineseSub = (video.subtitles.search('Chinese') >= 0) ? 'checked' : '';
	video.englishSub = (video.subtitles.search('English') >= 0) ? 'checked' : '';
	video.malaySub = (video.subtitles.search('Malay') >= 0) ? 'checked' : '';
	video.tamilSub = (video.subtitles.search('Tamil') >= 0) ? 'checked' : '';
}

// Adds new video jot from /video/addVideo
router.post('/addVideo', ensureAuthenticated, (req, res) => {
	let title = req.body.title;
	let story = req.body.story;
	let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
	let language = req.body.language.toString();
	let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
	let classification = req.body.classification;
	let userId = req.user.id;
	let posterURL = req.body.posterURL;
	let starring = req.body.starring;

	// Multi-value components return array of strings or undefined
	Video.create({
		title,
		story,
		classification,
		language,
		subtitles,
		dateRelease,
		posterURL,
		starring,
		userId
	}).then((video) => {
		res.redirect('/video/listVideos'); // redirect to call router.get(/listVideos...) to retrieve all updated
		// videos
	}).catch(err => console.log(err))
});

// save edited video
router.put('/saveEditedVideo/:id', ensureAuthenticated, (req, res) => {
	let title = req.body.title;
	let story = req.body.story.slice(0, 100);
	let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
	let language = req.body.language.toString();
	let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
	let classification = req.body.classification;
	let posterURL = req.body.posterURL;
	let starring = req.body.starring;

	/* console.log(`\n++++++++ Video from session: ${req.session.video.title}`);
	 console.log(`\n++++++++ All videos from session: ${req.session.allVideos}`); */
	console.log(`URL: ${posterURL}`);
	Video.update({
		title,
		story,
		classification,
		language,
		subtitles,
		dateRelease,
		posterURL,
		starring
	}, {
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.redirect('/video/listVideos'); // redirect to call router.get(/listVideos...) to retrieve all updated
			// videos
	}).catch(err => console.log(err));
});

// List videos belonging to current logged in user
router.get('/listVideos', ensureAuthenticated, (req, res) => {
	Video.findAll({
		where: {
			userId: req.user.id
		},
		order: [
			['title', 'ASC']
		],
		raw: true
	})
	.then((videos) => {
		// pass object to listVideos.handlebar
		res.render('video/listVideos', { 
			videos: videos
		});
	})
	.catch(err => console.log(err));
});


router.get('/delete/:id', ensureAuthenticated, (req, res) => {
	let videoId = req.params.id;
	let userId = req.user.id;
	// Select * from videos where videos.id=videoID and videos.userId=userID
	Video.findOne({
		where: {
			id: videoId,
			userId: userId
		},
		attributes: ['id', 'userId']
	}).then((video) => {
		// if record is found, user is owner of video
		if (video != null) {
			Video.destroy({
				where: {
					id: videoId
				}
			}).then(() => {
				alertMessage(res, 'info', 'Video Jot deleted', 'far fa-trash-alt', true);
				res.redirect('/video/listVideos'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} else {
			alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
			res.redirect('/logout');
		}
	});
});
module.exports = router;