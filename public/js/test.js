// test.js
var refRecorder = null;

var toggleButton = document.getElementById('toggleButton');
var icon = document.getElementById('icon');
var isMuted = false;

toggleButton.addEventListener('click', toggleMute);

function toggleMute(e) {
    isMuted = !isMuted;
    if (isMuted) {
        icon.className = 'fas fa-microphone-slash'; // Font Awesome mute icon class
        startRecording(e);
    } else {
        icon.className = 'fas fa-microphone'; // Font Awesome unmute icon class
        stopRecording(e);
    }
}

function startRecording(event) {
    event.preventDefault();

    window.audio = new audiostream(
        function (recorder) {
            refRecorder = recorder;
            // $("#state").html("Thanks! Listen to your echo");
        },
        function (e) {
            var et = "unknown";
            switch (e.name) {
                case "PermissionDeniedError":
                    et = "Forbidden";
                    break;
            }
            // $("#state").html("").append("ERROR: " + et);
        }
    );

    window.audio.pipe = function (ev) {
        var blob = ev.data;
        socket.emit('audio-stream', blob);
        
        // Create a new stream for each transmission
        //var stream = ss.createStream();
        // Send the stream to the server
        //ss(socket).emit('audio-stream', stream);

        // Pipe the blob stream to the socket stream
        //ss.createBlobReadStream(blob).pipe(stream);

        // Optionally, you can play the audio locally
        //playAudio(blob);
    };
}

// Function to stop recording
function stopRecording(event) {
    event.preventDefault(); // Prevent the default behavior (e.g., page reload)
    if (refRecorder) {
        refRecorder.stop();
    }
};

// Listen for audio data from the server
// socket.on('audio-data', function (data) {
//     console.log("rcv");
//     playAudio(data);
// });

function playAudio(data) {

    // Convert the received data (Buffer) to a Blob
    var blob = new Blob([data], { type: 'audio/wav' });

    // Create an audio element and set the source to the Blob URL
    var audio = new Audio(URL.createObjectURL(blob));

    // Play the audio
    audio.play();
}


