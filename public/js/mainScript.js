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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showAlert(message, type) {
  // Create the alert element
  const alertElement = document.createElement("div");
  alertElement.classList.add(
    "alert",
    `alert-${type}`,
    "position-fixed",
    "bottom-0",
    "end-0",
    "m-3"
  );

  // Set the alert message
  alertElement.textContent = message;

  // Add the Font Awesome icon to the alert
  const iconElement = document.createElement("i");
  iconElement.classList.add("fas", "fa-info-circle", "me-2");
  alertElement.prepend(iconElement);

  // Add the alert to the DOM
  const container = document.body;
  container.appendChild(alertElement);

  // Remove the alert after a certain duration (e.g., 5 seconds)
  const duration = 10000; // Change the duration as needed
  setTimeout(() => {
    alertElement.remove();
  }, duration);
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
