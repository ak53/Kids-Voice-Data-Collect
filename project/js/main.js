function showPicture(){
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // 'rounded-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  $("#image").append('<img class="rounded-circle" src="images/high-five.gif"/>');
  $("p").html("High five! You learn't a lot today!");

  // jQuery can do a lot of crazy stuff, so make sure to Google around to find out more
}

function handleSignIn(){
	var provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  window.localStorage.setItem("nextState",1)
	  // The signed-in user info.
	  var user = result.user;
	  console.log(user.email)
	  window.localStorage.setItem("user",user.email)
	  var files_count=0;
	  	var storageRef = firebase.storage().ref(user.email);
	  	storageRef.listAll().then(function(result){
	  		result.items.forEach(function(fileRef){
	  			files_count++;
	  		});
	  	console.log(files_count);
	  	console.log("change!!!")
	  	window.localStorage.setItem("nextState",files_count+1)
	  	changePage()
	  	}), function(error){
	  		console.log(error)
	  	};

	  // changePage()


	  // prev = window.localStorage.getItem("user")
	  // var files_count=0
	  // if (prev){
	  // 	var storageRef = firebase.storage().ref(prev);
	  // 	storageRef.listAll().then(function(result){
	  // 		result.items.forEach(function(fileRef){
	  // 			files_count++;
	  // 		});
	  // 	console.log(files_count);
	  // 	console.log("change!!!")
	  // 	window.localStorage.setItem("nextState",files_count)
	  // 	// changePage()
	  // 	});
	  // }else{
	  // 	window.localStorage.setItem("user",user.email)
	  // 	window.localStorage.setItem("nextState",1)
	  // 	// changePage()

	  // }
	  // // changePage()





	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});



}

function changePage(){
	console.log("switching")
	var loc = location.href
	var lastIndex = loc.lastIndexOf("/")
	loc = loc.slice(0,lastIndex + 1)
	loc = loc.concat("projects")
	location.href=loc	
}
