// Listen for edited message events from the server
socket.on("editedMessage", async (message) => {
  await editListItemById(message.id, message.text);
});

async function handleEditMessage(message) {
  const id = message.querySelector(".message-content").getAttribute("id");

  if (id) {
    // Retrieve the message content
    const messageContent = message.querySelector(
      ".message-content > p"
    ).textContent;

    // Set the message content as the value of the textarea
    messageInput.value = messageContent.trim();

    // Set focus to the textarea
    messageInput.focus();

    // Add the "edit mode" class to the textarea
    messageInput.classList.add("edit-mode");

    messageInput.setAttribute("sequence-id", id);

    // Create the cancel button
    var cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancelButton");
    cancelButton.setAttribute("class", "btn btn-secondary");
    cancelButton.textContent = "Cancel";
    cancelButton.style.marginRight = "10px";
    cancelButton.addEventListener("click", (event) => {
      leaveEditMode(event);
    });
    // Add the cancel button before the textarea
    messageInput.parentNode.insertBefore(cancelButton, messageInput);
  }
}

const editMessage = async (id) => {
  // Emit socket request to edit the message
  socket
    .timeout(15000)
    .emit(
      "editMessage",
      { id: id, text: messageInput.value },
      async (err, response) => {
        if (err) {
          // Handle the case where the server did not acknowledge the event
          console.error("Error:", err);
          showAlertModal(
            "Error",
            "Failed to edit message",
            "danger",
            true,
            5000
          );
        } else {
          await editListItemById(id, messageInput.value);
        }
      }
    );
};

const editListItemById = async (id, text) => {
  // Remove the message from the UI
  const messageContent = document.querySelector(
    `li.message > div.message-container > div.message-content[id="${id}"]`
  );

  if (messageContent) {
    // Apply background color effect
    messageContent.parentNode.parentNode.classList.add("flickering-messages");

    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 500));

    // first child node is <p> which holds the message
    messageContent.childNodes[0].textContent = text;

    leaveEditMode();

    // remove background color effect
    messageContent.parentNode.parentNode.classList.remove(
      "flickering-messages"
    );
  }
};

const leaveEditMode = (event = null) => {
  if (event) event.preventDefault();

  // Clear the textarea
  messageInput.value = "";

  // leave edit mode
  messageInput?.classList?.remove("edit-mode");
  messageInput.removeAttribute("sequence-id");

  removeCancelButton();
};

const removeCancelButton = () => {
  // Get the cancel button element
  var cancelButton = document.getElementById("cancelButton");

  // Get the parent element of the cancel button
  var parentElement = cancelButton?.parentNode;

  // Remove the cancel button
  parentElement?.removeChild(cancelButton);
};
