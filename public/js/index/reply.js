// Function to cancel the reply and hide the container
function cancelReply() {
  // Get the parent container
  const parentContainer = document.getElementById("messageForm");

  // Get the reply container
  const replyContainer = document.getElementById("reply-container");

  // Remove the reply container from the parent container
  parentContainer.removeChild(replyContainer);

  // leave reply mode
  messageInput?.classList?.remove("reply-mode");
  messageInput.removeAttribute("sequence-id");
}

// Function to show the reply container with the specified message
const showReply = (message) => {
  // Retrieve the message content
  const messageContent = message.querySelector(
    ".message-content > p"
  ).textContent;

  const id = message.querySelector(".message-content").getAttribute("id");

  if (id) {
    // Create the reply container
    const replyContainer = document.createElement("div");
    replyContainer.id = "reply-container";

    // Create the reply message container
    const replyMessage = document.createElement("div");
    replyMessage.id = "reply-message";

    // Create the reply text element
    const replyText = document.createElement("p");
    replyText.id = "reply-text";
    replyText.textContent = messageContent;

    // Create the cancel reply button
    const cancelReplyBtn = document.createElement("button");
    cancelReplyBtn.id = "cancel-reply";
    cancelReplyBtn.textContent = "Cancel";
    cancelReplyBtn.addEventListener("click", cancelReply);

    // Append the reply text and cancel reply button to the reply message container
    replyMessage.appendChild(replyText);
    replyMessage.appendChild(cancelReplyBtn);

    // Append the reply message container to the reply container
    replyContainer.appendChild(replyMessage);

    // Append the reply container to the desired parent container
    const parentContainer = document.getElementById("messageForm");
    parentContainer.prepend(replyContainer);

    // Set focus to the textarea
    messageInput.focus();

    // Add the "edit mode" class to the textarea
    messageInput.classList.add("reply-mode");

    messageInput.setAttribute("sequence-id", id);
  }
};

/**
 *
 * @param {*} info {username, message}
 * @returns
 */
function createRepliedMessage(info) {
  // Create the parent container
  var container = document.createElement("div");
  container.classList.add("replied-to");

  // Create the "Replied to:" content with the username
  var repliedContent = document.createElement("div");
  repliedContent.classList.add("replied-content");
  repliedContent.textContent = "Replied to: " + info.username;
  container.appendChild(repliedContent);

  // Create the replied message content
  var repliedMessage = document.createElement("div");
  repliedMessage.classList.add("replied-message");
  repliedMessage.textContent = info.text;
  container.appendChild(repliedMessage);

  return container;
  // Append both elements to the parent container
  //   messageContent.prepend(container);
  //   sendMessage(message);
  //   cancelReply(id);
}

function getReplyToInfo(id, maxLength = 50) {
  const messageContent = document.querySelector(
    `li.message > div.message-container > div.message-content[id="${id}"]`
  );
  const username =
    messageContent.parentNode.querySelector(".username").textContent;

  let message = messageContent.querySelector("P").textContent;

  // Shorten the message if it exceeds the maximum length
  if (message.length > maxLength) {
    message = message.substring(0, maxLength - 3) + "...";
  }
  return { username, message };
}
// Example usage
// var message =
//   "This is a long message that needs to be shortened to fit within a specific length.";
// var maxLength = 50; // Maximum length for the shortened message
// var username = "JohnDoe"; // Username to be displayed
// createRepliedMessage(message, maxLength, username);
