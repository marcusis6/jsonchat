const handleDownloadChat = async (event) => {
  const button = event.target;

  // Disable all buttons temporarily
  disableButtons();

  button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading`;

  // Perform the request after a delay of 1000 milliseconds
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(`/api/chat/download`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to download chat file");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "chat.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.log(error);
      showAlertModal(
        "Error",
        "Failed to download messages",
        "danger",
        true,
        5000
      );
    });

  // Enable all buttons
  enableButtons();

  button.innerHTML = "Download Chat";
};

const downloadButton = document.getElementById("download-chat");
downloadButton.addEventListener("click", handleDownloadChat);
