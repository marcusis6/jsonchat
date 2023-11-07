// Listen for deleted message events from the server
socket.on("deletedMessage", async (id) => {
  console.log(id);
  await removeListItemById(id);

  // remove message from receivedMessages array
  receivedMessages = receivedMessages.filter((item) => item.id !== id);
});

const removeListItemById = async (id) => {
  // Remove the message from the UI
  const messageContent = document.querySelector(
    `li.message.received > div.message-container > div.message-content[id="${id}"]`
  );

  if (messageContent) {
    // Apply background color effect
    messageContent.parentNode.parentNode.classList.add("flickering-messages");

    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 500));

    messageContent.parentNode.parentNode.parentNode.removeChild(
      messageContent.parentNode.parentNode
    );
  }
};

async function handleDeleteMessage(message) {
  try {
    const id = message.querySelector(".message-content").getAttribute("id");

    if (id) {
      // Update the confirm button with the spinner icon
      confirmButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Deleting';

      // Perform the request after a delay of 1000 milliseconds
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Emit socket request to delete the message
      socket.timeout(15000).emit("deleteMessage", id, async (err, response) => {
        if (err) {
          // Handle the case where the server did not acknowledge the event
          console.error("Error:", err);
          showAlertModal(
            "Error",
            "Failed to delete message",
            "danger",
            true,
            5000
          );
        } else {
          // showAlertModal(
          //   "Success",
          //   "Message deleted successfully",
          //   "success",
          //   true,
          //   3000
          // );

          console.log(response);

          // Apply background color effect
          message.classList.add("flickering-messages");

          // Perform the request after a delay of 1000 milliseconds
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Remove the message from the UI
          message.remove();

          // Remove message from receivedMessages array
          receivedMessages = receivedMessages.filter((item) => item.id !== id);
        }
      });

      // Reset the confirm button's HTML content
      confirmButton.innerHTML = "Delete";
    }
  } catch (err) {
    console.error(err);
  }
}
