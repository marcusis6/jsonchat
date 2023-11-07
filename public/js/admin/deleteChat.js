// Listen for edited message events from the server
socket.on("chatDeleted", () => {
  receivedMessages = [];
  chatBox.innerHTML = "";
  // Show success alert
  showAlertModal(
    "Success",
    "Chat deleted successfully by admin",
    "success",
    true,
    3000
  );
});

const handleConfirmDeleteChat = async () => {
  // Disable all buttons temporarily
  disableButtons();

  // Update the confirm button with the spinner icon
  confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting';

  try {
    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Emit socket request to delete the message
    socket.timeout(15000).emit("deleteChat", async (err, response) => {
      if (err) {
        // Handle the case where the server did not acknowledge the event
        showAlertModal("Error", "Failed to delete chat", "danger", true, 5000);
      } else {
        // Show success alert
        showAlertModal(
          "Success",
          "Chat deleted successfully",
          "success",
          true,
          3000
        );
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Reset the confirm button's HTML content
    confirmButton.innerHTML = "Delete";

    // Enable all buttons
    enableButtons();
  }
};

const deleteButton = document.getElementById("delete-chat");
deleteButton.addEventListener("click", async (event) => {
  openConfirmModal(() => {
    handleConfirmDeleteChat();
  });
});
