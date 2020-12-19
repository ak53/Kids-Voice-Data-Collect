// set up basic variables for app
count = 0;
var dict = { 1 : 'APPLE' , 
             2 : 'BALL' , 
             3 : 'BEACH',
             4 : 'BOY' ,
             5 : 'CHAIR' ,
             6 : 'CROWN' ,
             7 : 'DOG' ,
             8 : 'FISH' ,
             9 : 'FLOWER',
             10 : 'HOME' ,
             11 : 'ICE' ,
             12 : 'JUG' ,
             13 : 'KING' ,
             14 : 'MOTHER' ,
             15 : 'PENCIL' ,
             16 : 'PHONE',
             17 : 'QUEEN' ,
             18 : 'REINDEER',
             19 : 'SHIRT',
             20 : 'STAR' ,
             21 : 'TELEVISION' ,
             22 : 'THIEF',
             23 : 'YELLOW' ,
             24 : 'ZEBRA' ,
             25 : 'ZOO', 
           };

var nextState = window.localStorage.getItem("nextState");

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording
console.log("started")

stop.disabled = true;

// visualiser setup - create web audio api context and canvas
console.log("started")

let audioCtx;
const canvasCtx = canvas.getContext("2d");
//main block for doing the audio recording
console.log("started")

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      var audio = document.getElementById('audio');
      console.log(audio.paused)
      if (audio.paused){
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        stop.disabled = false;
        record.disabled = true;
      }
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }




    mediaRecorder.onstop = function(e) {
      count++;
      console.log("data available after MediaRecorder.stop() called.");

      // const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      var clipName = nextState-1
      if (nextState=="end"){
        clipName="last"
      }
      if (count>1){
        var c = soundClips.children;
        var i;
        for (i = 0; i < c.length; i++) {
          soundClips.removeChild(c[i])
        }
      }

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');
      const submitButton = document.createElement('button');


      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
      submitButton.textContent = 'Submit';
      submitButton.className = 'submit';

      // if(clipName === null) {
      //   clipLabel.textContent = 'My unnamed clip';
      // } else {
      //   clipLabel.textContent = clipName;
      // }

      clipContainer.appendChild(audio);
      // clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      clipContainer.appendChild(submitButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

        var file = blob
        file.name = clipName
        console.log(file)
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();
      // File or Blob named mountains.jpg

        // Create the file metadata
        var metadata = {
          contentType: 'audio/oog'
        };

        folder = window.localStorage.getItem("user")
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child(folder+'/' + file.name).put(file, metadata);

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
            submitButton.onclick = function(e) {
              if (nextState>25){
                var loc = location.href
                var index = loc.lastIndexOf("/")
                template = loc.slice(0,index + 1)
                loc = template.concat("end")
                location.href=loc                
              }
              s = "images/"+nextState+".jpeg";
              document.getElementById("word_img").src = s;
              s2 = "audios/"+nextState+".mp3";
              var audio = document.getElementById('audio');
              document.getElementById('track').src = s2;
              audio.load();

              // temp = '<img class="rounded-circle src="images/2.jpeg"/>'
              // $(".word_image").append(temp);
              $(".word").html(dict[nextState]);
              nextState++;

            // if nextState!="end"{
              // var loc = location.href
              // var index = loc.lastIndexOf("/")
              // template = loc.slice(0,index + 1)
              // loc = template.concat(nextState.toString())
              // location.href=loc
          
            }
          });
        });

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }




      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }

    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();