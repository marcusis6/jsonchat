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
  newMessage.classList.add("message", "chat-message");

  // Create a message container
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  // Create the message header
  const messageHeader = document.createElement("div");
  messageHeader.classList.add("message-header");

  // Create the time element
  const timeElement = document.createElement("span");
  timeElement.classList.add("time");
  timeElement.textContent = message.time;

  // Assign or retrieve the color for the username
  var usernameColor = getUsernameColor(message.username);

  // Create a username element
  const usernameElement = document.createElement("span");
  usernameElement.classList.add("username");
  usernameElement.style.color = usernameColor;
  usernameElement.textContent = message.username;

  // Append the username and time to the message header
  messageHeader.appendChild(usernameElement);
  messageHeader.appendChild(timeElement);

  // Create a message content element
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.id = message.id; // Set the message ID

  const paragraph = document.createElement("p");
  paragraph.textContent = message.text;
  messageContent.appendChild(paragraph);

  if (message.replyTo && message.replyTo.username && message.replyTo.text) {
    const replyElement = createRepliedMessage({
      username: message.replyTo.username,
      text: message.replyTo.text,
    });
    messageContent.prepend(replyElement);
  }
  // Create the message footer
  const messageFooter = document.createElement("div");
  messageFooter.classList.add("message-footer");

  if (loading) {
    // Create a loading spinner element
    const spinnerElement = document.createElement("i");
    spinnerElement.classList.add("fas", "fa-spinner", "fa-spin");

    // Create the status element
    const statusElement = document.createElement("span");
    statusElement.classList.add("status");
    statusElement.textContent = "Sending...";

    // Append the spinner and status to the message footer
    messageFooter.appendChild(spinnerElement);
    messageFooter.appendChild(statusElement);
  }

  // Append the username and message content to the container
  messageContainer.appendChild(messageHeader);
  messageContainer.appendChild(messageContent);
  messageContainer.appendChild(messageFooter);

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

// Map to store username-color associations
var usernameColorMap = new Map();

// Array of predefined color palettes with darker shades
var colorPalettes = [
  ["#512DA8", "#303F9F", "#1A237E", "#0D47A1"], // Deep purple shades
  ["#303F9F", "#1E88E5", "#1565C0", "#0D47A1"], // Blue shades
  ["#1E88E5", "#039BE5", "#0288D1", "#01579B"], // Light blue shades
  ["#039BE5", "#00ACC1", "#00838F", "#006064"], // Cyan shades
  ["#00ACC1", "#00897B", "#00695C", "#004D40"], // Teal shades
  ["#00897B", "#00796B", "#00695C", "#004D40"], // Green shades
  ["#00796B", "#00695C", "#004D40", "#00352E"], // Dark green shades
  ["#00695C", "#004D40", "#00352E", "#00251A"], // Very dark green shades
  ["#EF6C00", "#E65100", "#BF360C", "#DD2C00"], // Orange shades
  ["#E65100", "#BF360C", "#DD2C00", "#BF360C"], // Dark orange shades
  ["#BF360C", "#DD2C00", "#BF360C", "#9E0000"], // Deep orange shades
];

function getUsernameColor(username) {
  // Check if the username already has a color assigned
  if (usernameColorMap.has(username)) {
    return usernameColorMap.get(username);
  } else {
    // Generate a new color from a random color palette
    var colorPalette = generateRandomColor();
    var randomIndex = Math.floor(Math.random() * colorPalette.length);
    var color = colorPalette[randomIndex];
    // Store the color for the username
    usernameColorMap.set(username, color);
    return color;
  }
}

// Generate a random color
function generateRandomColor() {
  var randomIndex = Math.floor(Math.random() * colorPalettes.length);
  return colorPalettes[randomIndex];
}
