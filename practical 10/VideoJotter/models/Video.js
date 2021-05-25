const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Video = db.define('video', {
	title: {
		type: Sequelize.STRING
	},
	story: {
		type: Sequelize.STRING(1000)
	},
	language: {
		type: Sequelize.STRING
	},
	
	subtitles: {
		type: Sequelize.STRING,
	},
	classification: {
		type: Sequelize.STRING
	},
	starring: {
		type: Sequelize.STRING,
	},
	posterURL: {
		type: Sequelize.STRING(512),
	},
	dateRelease: {
		type: Sequelize.DATE
	}
});

module.exports = Video;
