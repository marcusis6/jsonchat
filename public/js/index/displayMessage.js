// Function to display single message on the frontend
/**
 *
 * @param {*} message
 * @param {*} loading
 * @returns {HTMLElement}
 */
const displayMessage = (message, loading = false) => {
  const chatBox = document.getElementById("chat");
  const generatedMessage = generateSingleMessage(message, loading);
  chatBox.appendChild(generatedMessage);
  return generatedMessage;
};

// Function to display the messages on the frontend
const displayMessages = (messages) => {
  const chatBox = document.getElementById("chat");
  chatBox.innerHTML = ""; // before displaying all message clear the previous messages
  const generatedMessages = generateMessages(messages);
  for (const item of generatedMessages) {
    // Append the generated message to the chat box
    chatBox.appendChild(item);
  }
};

// Function to display the prepended messages on the frontend
const prependMessages = (messages) => {
  const chatBox = document.getElementById("chat");
  const result = generateMessages(messages);

  // Create a wrapper div for the prepended messages
  const wrapper = document.createElement("div");
  wrapper.classList.add("prepended-messages-wrapper");

  // Add the messages to the wrapper div
  result.forEach((item) => {
    wrapper.appendChild(item);
  });

  // Prepend the wrapper div to the chat box
  chatBox.prepend(wrapper);

  // Apply background color effect to the wrapper div
  wrapper.classList.add("flickering-messages");

  // Remove the wrapper div after a short delay
  setTimeout(() => {
    wrapper.classList.remove("flickering-messages");
  }, 1000); // Adjust the delay duration as needed
};
