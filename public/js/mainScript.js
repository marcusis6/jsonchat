// Add event listener to language select dropdown
// Changes the URL with the selected language as a query parameter
// Redirects to the new URL
// const langSelect = document.getElementById("lang-select");
// langSelect.addEventListener("change", function () {
//   const lang = langSelect.value; // Get the selected language
//   const url = new URL(window.location.href); // Get the current URL
//   url.searchParams.set("lang", lang); // Set the language as a query parameter
//   window.location.href = url.href; // Redirect to the new URL
// });

// Register button click event listener
const registerBtn = document.getElementById("register-btn");
const registerBtnContent = document.getElementById("register-btn-spinner");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    registerBtnContent.classList.add("spinner-border", "spinner-border-sm");
    registerBtn.setAttribute("disabled", true);
    document.getElementById("register-form").submit();
  });
}

// Login button click event listener
const loginBtn = document.getElementById("login-btn");
const loginBtnContent = document.getElementById("login-btn-spinner");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    loginBtnContent.classList.add("spinner-border", "spinner-border-sm");
    loginBtn.setAttribute("disabled", true);
    document.getElementById("login-form").submit();
  });
}

// Disable all buttons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const disableButtons = () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = true;
  });
};

// Enable all buttons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const enableButtons = () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
};

const confirmModal = new bootstrap.Modal(
  document.getElementById("confirmModal")
);
const confirmButton = document.getElementById("confirmButton");

const openConfirmModal = (callback) => {
  confirmModal.show();

  const confirmButtonClickHandler = () => {
    confirmModal.hide();
    callback();
    confirmButton.removeEventListener("click", confirmButtonClickHandler); // Remove the event listener
  };

  confirmButton.addEventListener("click", confirmButtonClickHandler);
};

/**
 * Show an alert modal with the specified title, message, type, and optional auto-dismiss behavior.
 *
 * @param {string} title - The title of the alert modal.
 * @param {string} message - The message of the alert modal.
 * @param {string} type - The type of the alert. Possible values: "success", "danger", "warning", "info".
 * @param {boolean} autoDismiss - (Optional) Whether to auto-dismiss the modal. Default: false.
 * @param {number} dismissTimeout - (Optional) The timeout in milliseconds before auto-dismissing the modal. Only applicable if autoDismiss is true. Default: 5000.
 */
function showAlertModal(title, message, type, autoDismiss, dismissTimeout) {
  const modal = document.getElementById("alertModal");
  const modalTitle = document.getElementById("alertModalLabel");
  const modalMessage = document.getElementById("alertMessage");
  const modalIcon = document.getElementById("alertIcon");

  // Clear any existing classes and icons
  modal.classList.remove(
    "alert-primary",
    "alert-secondary",
    "alert-success",
    "alert-danger",
    "alert-warning",
    "alert-info"
  );
  modalIcon.innerHTML = ""; // Clear the icon element

  // Set the alert type class and icon
  switch (type) {
    case "success":
      modal.classList.add("alert-success");
      modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>'; // Replace with the appropriate Font Awesome 6 icon
      break;
    case "danger":
      modal.classList.add("alert-danger");
      modalIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>'; // Replace with the appropriate Font Awesome 6 icon
      break;
    case "warning":
      modal.classList.add("alert-warning");
      modalIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>'; // Replace with the appropriate Font Awesome 6 icon
      break;
    case "info":
      modal.classList.add("alert-info");
      modalIcon.innerHTML = '<i class="fas fa-info-circle"></i>'; // Replace with the appropriate Font Awesome 6 icon
      break;
    default:
      modal.classList.add("alert-primary");
  }

  // Set the modal title and message
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Show the modal
  const alertModal = new bootstrap.Modal(modal);
  alertModal.show();

  // Auto-dismiss after a specified timeout
  if (autoDismiss) {
    setTimeout(() => {
      alertModal.hide();
    }, dismissTimeout);
  }
}

// Jump to Last msg functionality
function scrollToLastMessage() {
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
}

function displayScrollIcon() {
  var jumpToButton = document.getElementById("jump-to-last");
  var chatBox = document.querySelector(".message-box");

  var msgWindowHeight = chatBox.clientHeight;
  var msgPosition = chatBox.scrollHeight - chatBox.scrollTop;
  var scrollDistance = msgPosition - msgWindowHeight;
  var lastMsgHeight = chatBox.querySelector("li:last-child").clientHeight;

  if (scrollDistance >= lastMsgHeight) {
    jumpToButton.style.display = "block";
  } else {
    jumpToButton.style.display = "none";
  }
}

var jumpToButton = document.getElementById("jump-to-last");
var chatBox = document.querySelector(".message-box");

chatBox.addEventListener("scroll", displayScrollIcon);
jumpToButton.addEventListener("click", scrollToLastMessage);

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

const replyMessage = (id) => {
  const messageContent = document.querySelector(
    `li.message > div.message-container > div.message-content[id="${id}"]`
  );
  const username = messageContent.parentNode.childNodes[0].textContent;
  let text_to_reply =
    username + ": " + messageContent.childNodes[0].textContent;
  if (text_to_reply.length > 200) {
    text_to_reply =
      text_to_reply.slice(0, 100) +
      "     ...............     " +
      text_to_reply.slice(text_to_reply.length - 100, text_to_reply.length);
  }
  text_to_reply = text_to_reply + "   ===>   ";
  text_to_reply = text_to_reply + messageInput.value.replace(/<br>/g, "\n");
  sendMessage(text_to_reply);
  cancelReply(id);
};

// Get the logout button element by its ID
const logoutButton = document.getElementById("logout-btn");

// Add a click event listener to the logout button
logoutButton.addEventListener("click", () => {
  // Perform the logout action here
  // You can make an AJAX request to the server to trigger the logout route
  // or perform any necessary cleanup

  // Redirect the user to the logout route on the server
  window.location.href = "/auth/logout";
});
