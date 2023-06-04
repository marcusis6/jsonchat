// Add this script to your code to initialize Socket.IO connection
// and handle chat events.
// eslint-disable-next-line no-undef
const socket = io();

// Get current username
const currentUsername = document.getElementById("current-username").textContent;

const messageInput = document.getElementById("message");

messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
    event.preventDefault(); // Prevent the newline character from being inserted in the textarea
  }
});

function sendMessage() {
  const message = messageInput.value;

  // Generate a unique ID for the message
  const id = crypto.randomUUID();

  // Show loading spinner with "Sending..." status
  const newMessage = displayMessageStatus(message, "Sending...", id);

  // Get the spinner element within the new message
  const spinnerElement = newMessage.querySelector(".fa-spinner");

  // Emit the chatMessage event to the server with the message and message ID and timeout
  socket
    .timeout(5000)
    .emit("chatMessage", { text: message, id }, (err, response) => {
      if (err) {
        // Handle the case where the server did not acknowledge the event
        console.error("Error:", err);

        // Display "Message Sent Failed" status for the message
        updateMessageStatus(newMessage, message, "Message Sent Failed");

        // Stop the loading spinner
        stopLoadingSpinner(spinnerElement);
      } else {
        console.log("Acknowledgement received:", response);

        // Display check mark for successful message sending
        updateMessageStatus(newMessage, message, "✓");

        // Stop the loading spinner
        stopLoadingSpinner(spinnerElement);
      }
    });

  messageInput.value = "";
}

// Function to display message status
function displayMessageStatus(message, status, id) {
  const chatBox = document.getElementById("chat");
  const newMessage = document.createElement("li");

  newMessage.classList.add("message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

  if (id) {
    messageContent.dataset.id = id;
  }

  // Create a username element
  const usernameElement = document.createElement("span");
  usernameElement.classList.add("username");
  usernameElement.textContent = currentUsername;

  // Add username before message content
  newMessage.appendChild(usernameElement);

  // Create a loading spinner element
  const spinnerElement = document.createElement("i");
  spinnerElement.classList.add("fas", "fa-spinner", "fa-spin");

  // Create the status element
  const statusElement = document.createElement("span");
  statusElement.classList.add("status");
  statusElement.textContent = status;

  // Append the spinner element and status element to the new message
  newMessage.appendChild(messageContent);
  newMessage.appendChild(spinnerElement);
  newMessage.appendChild(statusElement);

  chatBox.appendChild(newMessage);

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;

  return newMessage;
}

// Function to update message status
function updateMessageStatus(messageElement, message, status) {
  const statusElement = messageElement.querySelector(".status");
  if (statusElement) {
    statusElement.textContent = status;
  }

  const failedStatusElement = messageElement.querySelector(".failed-status");
  if (failedStatusElement && status !== "Message Sent Failed") {
    messageElement.removeChild(failedStatusElement);
  }
}

// Function to stop the loading spinner
function stopLoadingSpinner(spinnerElement) {
  if (spinnerElement && spinnerElement.parentNode) {
    spinnerElement.parentNode.removeChild(spinnerElement);
  }
}

// Listen for chatMessage events from the server
socket.on("chatMessage", (message) => {
  console.log(message);
  // Check if the message is sent by the current user
  const isSentByCurrentUser = message.sender === socket.id;

  // Find the existing message with the same message ID but with "Message Sent Failed" status
  // Remove any existing message with the same message ID and failed status
  const chatBox = document.getElementById("chat");
  const existingMessages = chatBox.querySelectorAll(
    ".message-content[data-message-id]"
  );

  existingMessages.forEach((existingMessage) => {
    if (existingMessage.dataset.id === message.id) {
      const failedStatusElement = existingMessage.nextElementSibling;
      if (
        failedStatusElement &&
        failedStatusElement.classList.contains("failed-status")
      ) {
        existingMessage.parentElement.removeChild(failedStatusElement);

        // Check if there are any other status elements
        const statusElements =
          existingMessage.parentElement.querySelectorAll(".status");
        if (statusElements.length === 0) {
          // If no other status elements exist, add the check mark status
          const checkStatusElement = document.createElement("span");
          checkStatusElement.classList.add("status");
          checkStatusElement.textContent = "✓";
          existingMessage.parentElement.appendChild(checkStatusElement);
        }
      }
    }
  });

  // If the message is sent by the current user, return and do not display it in the message box
  if (isSentByCurrentUser) {
    return;
  }

  // Create a list item for the message
  const newMessage = document.createElement("li");
  newMessage.classList.add("message");

  // Create a message container
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  // Create a username element
  const usernameElement = document.createElement("span");
  usernameElement.classList.add("username");
  usernameElement.textContent = message.username;

  // Create a message content element
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message.text; // Update to access the text property
  messageContent.dataset.id = message.id; // Set the message ID

  // Append the username and message content to the container
  messageContainer.appendChild(usernameElement);
  messageContainer.appendChild(messageContent);

  // Add appropriate classes based on the sender of the message
  if (isSentByCurrentUser) {
    newMessage.classList.add("sent");
  } else {
    newMessage.classList.add("received");
  }

  // Append the message container to the message
  newMessage.appendChild(messageContainer);

  // Append the message to the chat box
  chatBox.appendChild(newMessage);

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
});

// emit event for joining
socket.emit("join");

// Listen for "activeUsersList" event
socket.on("activeUsersList", (activeUsers) => {
  // Update the active users display
  displayActiveUsers(activeUsers);
});

// Function to display active users in the frontend
function displayActiveUsers(users) {
  const activeUserList = document.getElementById("activeUserList");
  activeUserList.innerHTML = "";

  users.forEach((userId) => {
    const listItem = document.createElement("li");
    listItem.textContent = userId;
    activeUserList.appendChild(listItem);
  });
}
