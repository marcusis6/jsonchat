// Function to generate the messages for frontend
const generateMessages = (messages) => {
  let result = [];
  for (const message of messages) {
    result.push(generateSingleMessage(message));
  }
  return result;
};

// Function to generate a single message for frontend
const generateSingleMessage = (message, loading = false) => {
  // Check if the message is sent by the current user
  const isSentByCurrentUser = message.username === currentUsername;

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
  messageContent.id = message.id; // Set the message ID

  const paragraph = document.createElement("p");
  paragraph.textContent = message.text;
  messageContent.appendChild(paragraph);

  // // Create a timestamp container
  // const timestamp = document.createElement("div");
  // timestamp.classList.add("timestamp");
  // timestamp.textContent = "12:34 PM";
  // messageContent.appendChild(timestamp);

  if (loading) {
    // Create a loading spinner element
    const spinnerElement = document.createElement("i");
    spinnerElement.classList.add("fas", "fa-spinner", "fa-spin");

    // Create the status element
    const statusElement = document.createElement("span");
    statusElement.classList.add("status");
    statusElement.textContent = "Sending...";

    messageContent.appendChild(spinnerElement);
    messageContent.appendChild(statusElement);
  }

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

  // add message actions
  addMessageActions(newMessage);

  return newMessage;
};
