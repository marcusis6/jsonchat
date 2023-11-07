// Add this script to your code to initialize Socket.IO connection
// and handle chat events.
// eslint-disable-next-line no-undef
const socket = io();
// Array to store received messages
let receivedMessages = [];

// Get current username
const currentUsername = document.getElementById("current-username").textContent;

const messageInput = document.getElementById("message");

messageInput.addEventListener("keypress", async (event) => {
  if (event.which == 13 && !event.shiftKey && messageInput.value.trim() != "") {
    if (messageInput.classList.contains("edit-mode")) {
      const id = messageInput.getAttribute("sequence-id");

      await editMessage(id);

      event.preventDefault(); // Prevent the newline character from being inserted in the textarea
    } else if (messageInput.classList.contains("reply-mode")) {
      const replyId = messageInput.getAttribute("sequence-id");
      sendMessage(messageInput.value, replyId);
      cancelReply(replyId);

      event.preventDefault(); // Prevent the newline character from being inserted in the textarea
    } else {
      sendMessage(messageInput.value); // Send
      event.preventDefault(); // Prevent the newline character from being inserted in the textarea
    }
  }
});

function sendMessage(message, replyId = null) {
  // message text
  let msg = { text: message, username: currentUsername };

  // add message reply to message
  if (replyId) {
    const info = getReplyToInfo(replyId);

    msg.replyTo = { username: info.username, text: info.message };
  }

  const newMessage = displayMessage(
    msg,
    true // loading
  );

  scrollToLastMessage();

  // Emit the chatMessage event to the server with the message and message ID and timeout
  socket.timeout(15000).emit("chatMessage", msg, (err, response) => {
    if (err) {
      // Handle the case where the server did not acknowledge the event
      console.error("Error:", err);

      // Display "Message Sent Failed" status for the message
      updateMessage(newMessage, null, false);
    } else {
      const updatedMessage = JSON.parse(response);

      if (assertMessageSequence(updatedMessage)) {
        receivedMessages.push(updatedMessage);

        console.log("Acknowledgement received:", updatedMessage);

        // Display check mark for successful message sending
        updateMessage(newMessage, updatedMessage, true);
      }
    }
  });

  messageInput.value = "";
}
// Listen for chatMessage events from the server
socket.on("chatMessage", async (message) => {
  // Play or pause audio based on sound preference
  if (isSoundOn) {
    audio.play();
  } else {
    audio.pause();
  }
  if (assertMessageSequence(message)) {
    receivedMessages.push(message);
    displayMessage(message);
    scrollToLastMessage();
  }
});

// Function to assert message sequence are aligned correctly
// If not aligned correctly requestMissingMessages will be called
const assertMessageSequence = async (message) => {
  const messageIndex = receivedMessages.length;

  if (messageIndex > 0) {
    const previousSequenceId = parseInt(receivedMessages[messageIndex - 1].id);
    const expectedSequenceId = previousSequenceId + 1;

    if (expectedSequenceId !== parseInt(message.id)) {
      await requestMissingMessages(expectedSequenceId);
    } else {
      return true;
    }
  } else {
    return true;
  }
};

// Function to request missing messages from the server
const requestMissingMessages = async (id) => {
  // Emit 'requestMissingMessages' event to the server with the missing sequence IDs
  socket
    .timeout(15000)
    .emit("requestMissingMessages", id, (err, receivedMissingMessages) => {
      if (err) {
        // Handle the case where the server did not acknowledge the event
        console.error("Error:", err);
      } else {
        console.log(JSON.parse(receivedMissingMessages));
        // Add the missing messages to the received messages array
        receivedMessages.push(...JSON.parse(receivedMissingMessages));

        // Sort the received messages based on sequence number
        receivedMessages.sort((a, b) => a.id - b.id);

        // Display all the received messages in order
        displayMessages(receivedMessages);
      }
    });
};

// Emit 'InitialMessages' event to the server
socket.timeout(15000).emit("InitialMessages", (err, response) => {
  if (err) {
    // Handle the case where the server did not acknowledge the event
    console.error("Error:", err);
  } else {
    // Add the initial messages to the received messages array
    receivedMessages.push(...JSON.parse(response));

    // Sort the received messages based on sequence number
    receivedMessages.sort((a, b) => a.id - b.id);

    // Display all the received messages in order
    displayMessages(receivedMessages);
  }
});

const loadMoreButton = document.getElementById("loadMoreButton");
const loadingSpinner = document.getElementById("loadingSpinner");
const loadMoreText = document.getElementById("loadMoreText");

// Function to show the loading spinner
const showLoadingSpinner = () => {
  loadingSpinner.style.display = "inline-block";
  loadMoreText.style.display = "none";
};

// Function to hide the loading spinner
const hideLoadingSpinner = () => {
  loadingSpinner.style.display = "none";
  loadMoreText.style.display = "inline-block";
};

// Function to load more messages from the server
const loadMoreMessages = () => {
  // Show the loading spinner
  showLoadingSpinner();

  // Send a request to the server to fetch more messages
  socket
    .timeout(15000)
    .emit("loadMoreMessages", receivedMessages.length, 25, (err, response) => {
      if (err) {
        // Handle the case where the server did not acknowledge the event
        console.error("Error:", err);
      } else {
        receivedMessages.unshift(...JSON.parse(response));
        prependMessages(JSON.parse(response));
      }

      // Hide the loading spinner after messages arrive
      hideLoadingSpinner();
    });
};

// Event listener for the "Load More" button
loadMoreButton.addEventListener("click", loadMoreMessages);

// allow textarea to be expandable
document.body.addEventListener("input", function (event) {
  const textarea = event.target;
  if (textarea.matches("textarea[data-expandable]")) {
    textarea.style.removeProperty("height");
    textarea.style.height = textarea.scrollHeight + 1 + "px";
  }
});
