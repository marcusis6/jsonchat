// Add this script to your code to initialize Socket.IO connection
// and handle chat events.
// eslint-disable-next-line no-undef
const socket = io();
// Array to store received messages
let receivedMessages = [];

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

  // Show loading spinner with "Sending..." status
  const newMessage = displayMessageStatus(message, "Sending...");

  // Get the spinner element within the new message
  const spinnerElement = newMessage.querySelector(".fa-spinner");

  // Emit the chatMessage event to the server with the message and message ID and timeout
  socket
    .timeout(5000)
    .emit("chatMessage", { text: message }, (err, response) => {
      if (err) {
        // Handle the case where the server did not acknowledge the event
        console.error("Error:", err);

        // Display "Message Sent Failed" status for the message
        updateMessageStatus(newMessage, message, "Message Sent Failed");

        // Stop the loading spinner
        stopLoadingSpinner(spinnerElement);
      } else {
        const updatedMessage = JSON.parse(response);

        receivedMessages.push(updatedMessage);

        console.log("Acknowledgement received:", updatedMessage);

        // Display check mark for successful message sending
        updateMessageStatus(newMessage, updatedMessage, "✓");

        // Stop the loading spinner
        stopLoadingSpinner(spinnerElement);
      }
    });

  messageInput.value = "";
}

// Function to display message status
function displayMessageStatus(message, status) {
  const chatBox = document.getElementById("chat");
  const newMessage = document.createElement("li");

  newMessage.classList.add("message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

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

  return newMessage;
}

// Function to update message status and add me
function updateMessageStatus(messageElement, message, status) {
  const messageContent = messageElement.querySelector(".message-content");
  if (message.sequence_id) {
    messageContent.id = message.sequence_id;
  }

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
socket.on("chatMessage", async (message) => {
  const messageIndex = receivedMessages.length;

  if (messageIndex > 0) {
    const previousSequenceId = receivedMessages[messageIndex - 1].sequence_id;
    const expectedSequenceId = previousSequenceId + 1;

    if (expectedSequenceId !== message.sequence_id) {
      await requestMissingMessages(expectedSequenceId);
    } else {
      receivedMessages.push(message);
      displayMessage(message);
    }
  } else {
    receivedMessages.push(message);
    displayMessage(message);
  }
});

// Function to request missing messages from the server
const requestMissingMessages = async (sequence_id) => {
  // Emit 'requestMissingMessages' event to the server with the missing sequence IDs
  socket.emit(
    "requestMissingMessages",
    sequence_id,
    (receivedMissingMessages) => {
      console.log(JSON.parse(receivedMissingMessages));
      // Add the missing messages to the received messages array
      receivedMessages.push(...JSON.parse(receivedMissingMessages));

      // Sort the received messages based on sequence number
      receivedMessages.sort((a, b) => a.sequence_id - b.sequence_id);

      // Display all the received messages in order
      displayMessages();
    }
  );
};

// Function to display the messages on the frontend
const displayMessages = () => {
  const chatBox = document.getElementById("chat");
  chatBox.innerHTML = ""; // before displaying all message clear the previous messages
  for (const message of receivedMessages) {
    displayMessage(message);
  }
};

// Function to display a single message on the frontend
const displayMessage = (message) => {
  // Check if the message is sent by the current user
  const isSentByCurrentUser = message.sender === socket.id;

  // Find the existing message with the same message ID but with "Message Sent Failed" status
  // Remove any existing message with the same message ID and failed status
  const chatBox = document.getElementById("chat");

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
  messageContent.id = message.sequence_id; // Set the message ID

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
};

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
