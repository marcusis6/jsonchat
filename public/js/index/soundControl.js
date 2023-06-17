const volumeBtn = document.getElementById("volume-btn");
const audio = new Audio("/notification.wav");
let soundPref = document.getElementById("soundPref").textContent;
let isSoundOn = soundPref === "true";

// Function to update the volume icon based on the sound preference
function updateVolumeIcon() {
  volumeBtn.innerHTML = `<i aria-hidden="true" class="fas ${
    isSoundOn ? "fa-volume-up" : "fa-volume-off"
  } sound-control"></i>`;
}

// Event listener for toggling the sound preference
volumeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  isSoundOn = !isSoundOn;
  updateVolumeIcon();

  // Play or pause audio based on sound preference
  if (isSoundOn) {
    audio.play();
  } else {
    audio.pause();
  }

  // Disable the button
  volumeBtn.disabled = true;

  // Send sound preference to the server using AJAX request
  fetch("/api/soundPref", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ soundPref: isSoundOn }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error saving sound preference:", error);
        showAlertModal(
          "Error",
          "Error saving sound preference",
          "danger",
          true,
          5000
        );
      }
      showAlertModal(
        "Success",
        "Sound updated successfully",
        "success",
        true,
        3000
      );
      // enable the button
      volumeBtn.disabled = false;
    })
    .catch((error) => {
      showAlertModal(
        "Error",
        "Error saving sound preference",
        "danger",
        true,
        5000
      );
      console.error("Error saving sound preference:", error);
      // Set default sound preference in case of error
      isSoundOn = true; // Set to the default value
      updateVolumeIcon();
      // enable the button
      volumeBtn.disabled = false;
    });
});

// Initialize the volume icon based on the sound preference
updateVolumeIcon();
