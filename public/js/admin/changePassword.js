// Handle form submission using Fetch API
const changePasswordForm = document.getElementById("change-password-form");
const changePasswordBtn = document.getElementById("change-password-btn");
const spinner = document.getElementById("change-password-btn-spinner");

changePasswordBtn.addEventListener("click", async () => {
  // Disable the button and show the spinner
  changePasswordBtn.disabled = true;
  spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate the password fields
  if (password === "" || confirmPassword === "") {
    showAlertModal(
      "Error",
      "Password fields cannot be empty",
      "danger",
      true,
      5000
    );

    // Re-enable the button and hide the spinner
    changePasswordBtn.disabled = false;
    spinner.innerHTML = "";
    return;
  }

  if (password !== confirmPassword) {
    showAlertModal(
      "Error",
      "Password and Confirm Password must match",
      "danger",
      true,
      5000
    );

    // Re-enable the button and hide the spinner
    changePasswordBtn.disabled = false;
    spinner.innerHTML = "";
    return;
  }

  const data = {
    username,
    password,
    confirmPassword,
  };

  try {
    const response = await fetch("/api/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Password changed successfully
      showAlertModal(
        "Success",
        "Your password has been changed successfully",
        "success",
        true,
        3000
      );
    } else {
      // Display error message
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlertModal(
      "Error",
      "An error occurred. Please try again later.",
      "danger",
      true,
      5000
    );
  } finally {
    // Re-enable the button and hide the spinner
    changePasswordBtn.disabled = false;
    spinner.innerHTML = "";
  }
});
