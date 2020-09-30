function showPicture(){
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // 'rounded-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  $("#image").append('<img class="rounded-circle" src="images/high-five.gif"/>');
  $("p").html("High five! You're building your first web app!");

  // jQuery can do a lot of crazy stuff, so make sure to Google around to find out more
  
}

function handleSubmit(){
	console.log("hi")
  const input = document.querySelector('input');
  var file = input.files[0]
  console.log(file)
  var storage = firebase.storage();

	// Create a storage reference from our storage service
	var storageRef = storage.ref();
// File or Blob named mountains.jpg

	// Create the file metadata
	var metadata = {
	  contentType: 'audio/mp3'
	};

	// Upload file and metadata to the object 'images/mountains.jpg'
	var uploadTask = storageRef.child('audio/' + file.name).put(file, metadata);

	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
	  function(snapshot) {
	    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	    console.log('Upload is ' + progress + '% done');
	    switch (snapshot.state) {
	      case firebase.storage.TaskState.PAUSED: // or 'paused'
	        console.log('Upload is paused');
	        break;
	      case firebase.storage.TaskState.RUNNING: // or 'running'
	        console.log('Upload is running');
	        break;
	    }
	  }, function(error) {

	  // A full list of error codes is available at
	  // https://firebase.google.com/docs/storage/web/handle-errors
	  switch (error.code) {
	    case 'storage/unauthorized':
	      // User doesn't have permission to access the object
	      break;

	    case 'storage/canceled':
	      // User canceled the upload
	      break;

	    // ...

	    case 'storage/unknown':
	      // Unknown error occurred, inspect error.serverResponse
	      break;
	  }
	}, function() {
	  // Upload completed successfully, now we can get the download URL
	  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
	    console.log('File available at', downloadURL);
	  });
	});




  // let storageRef = firebase.storage().ref();
  // let metadata = {
  //   contentType: 'audio/mp3',
  // };
  // // let filePath = `${this.file.externalDataDirectory}` + `${this.fileName}`;
  //   file.readAsDataURL(file.externalDataDirectory).then((file) => {
  //   let voiceRef = storageRef.child(`voices/${this.fileName}`).putString(file, firebase.storage.StringFormat.DATA_URL);
  //   voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
  //     console.log("uploading");
  //   }, (e) => {
  //     reject(e);
  //     console.log(JSON.stringify(e, null, 2));
  //   }, () => {
  //     var downloadURL = voiceRef.snapshot.downloadURL;
  //     resolve(downloadURL);
  //   });
  // });




	// var data = $("#word").val(); 
	// $("#word").val("")
	// console.log("hi")
	// console.log(data)
	// addToDatabase(player, url);
}

function addToDatabase(player, url){
	var postData = {
		a : player,
		b : url

	}
	var database = firebase.database().ref("posts");
	var newPostRef = database.push();
	newPostRef.set(postData);
}