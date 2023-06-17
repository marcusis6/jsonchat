/**
 * Function to update message status and add sequence id
 *
 * @param {HTMLElement} messageElement.
 * @param {string} id.
 * @param {boolean} status.
 *
 */
function updateMessage(messageElement, id, status) {
  const messageContent = messageElement.querySelector(".message-content");

  // add sequence id
  messageContent.id = id;

  const statusElement = messageElement.querySelector(".status");
  const failedStatusElement = messageElement.querySelector(".failed-status");

  if (status) {
    // message successfully sent after retry
    if (failedStatusElement) {
      failedStatusElement.classList.remove("failed-status");
      statusElement.classList.add("status");
      failedStatusElement.textContent = "✓";
    }

    // message successfully sent
    if (statusElement) {
      statusElement.textContent = "✓";
    }
  } else {
    // message failed to sent
    if (statusElement) {
      statusElement.classList.remove("status");
      statusElement.classList.add("failed-status");
      statusElement.textContent = "Message Sent Failed ";

      // Create a retry button element
      const retryButton = document.createElement("button");
      retryButton.classList.add("btn", "btn-outline-success", "btn-sm");
      retryButton.innerHTML = '<i class="fas fa-redo-alt"></i> Retry'; // Using Font Awesome icon

      retryButton.addEventListener("click", (event) => {
        retryMessageSend(messageContent);
      });

      // Append the retry button to the status element
      statusElement.appendChild(retryButton);
    }
  }

  // Get the spinner element within the new message
  const spinnerElement = messageElement.querySelector(".fa-spinner");

  // Stop the loading spinner
  stopLoadingSpinner(spinnerElement);
}

// Function to stop the loading spinner
function stopLoadingSpinner(spinnerElement) {
  if (spinnerElement && spinnerElement.parentNode) {
    spinnerElement.parentNode.removeChild(spinnerElement);
  }
}

// Retry message send function
function retryMessageSend(messageContent) {
  sendMessage(messageContent.childNodes[0].textContent);
  messageContent.parentNode.parentNode.remove();
}
