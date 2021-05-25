function ensureOneCheck(checkBoxName, messageId, submitId) {
	const checkBoxes = document.getElementsByName(checkBoxName);
	let checkCount = 0;
	for (let i=0; i < checkBoxes.length; i++){
		if (checkBoxes[i].checked)
			checkCount++;
	}
	if (checkCount === 0){
		document.getElementById(messageId).style.display = 'block';
		document.getElementById(submitId).disabled = true;
		return false;
	} else {
		document.getElementById(messageId).style.display = 'none';
		document.getElementById(submitId).disabled = false;
		return true;
	}
}

// Initial caps the title
function initialiseTitle(){
	let title = document.getElementById('title').value;
	let titleArr = [];
	let initTitle = '';
	if(title !== undefined){
		titleArr = title.trim().split(' ');
		for(let i=0; i < titleArr.length; i++){
			initTitle += titleArr[i].charAt(0).toUpperCase() + titleArr[i].slice(1) + ' ';
		}
		console.log(`Initialised title: ${initTitle}`);
		document.getElementById('title').value = initTitle;
	}
}

function getOMdbMovie(){
	const title = document.getElementById('title').value;
	const poster = document.getElementById('poster');
	const omdbErr = document.getElementById('OMdbErr');
	const posterURL = document.getElementById('posterURL');
	const story = document.getElementById('story');
	const starring = document.getElementById('starring');
	const datepicker = document.getElementById('datepicker');
	fetch('https://www.omdbapi.com/?t=' + title + '&apikey=d860e449')
		.then((res) => {
			return res.json();
		}).then((data) => {
			if (data.Response === 'False') {
				poster.src = '/img/no-image.jpg';
				omdbErr.style.display = 'inline';
			} else {
				omdbErr.style.display = 'none';
				poster.src = data.Poster;
				starring.value = data.Actors;
				posterURL.value = data.Poster;
				story.value = data.Plot;
				datepicker.value = moment(new Date(data.Released)).format('DD/MM/YYYY');
			}
			//document.getElementById('posterUpload').value = '';
	}).catch(error => {
		console.log(error);
		omdbErr.innerHTML = error;
	})
}