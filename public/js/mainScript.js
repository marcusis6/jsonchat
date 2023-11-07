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
