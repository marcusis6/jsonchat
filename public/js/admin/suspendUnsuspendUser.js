// Handle Suspend/Unsuspend User button click
const handleSuspendUnsuspendButtonClick = async (event) => {
  const button = event.target;
  const userItem = button.closest("tr");
  const userBadge = userItem.querySelector("td:nth-child(3) .badge");
  const userId = button.dataset.userId;
  const isSuspend = button.classList.contains("suspend-user-button");

  // Disable all buttons temporarily
  // eslint-disable-next-line no-undef
  disableButtons();

  button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading`;

  try {
    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `/api/users/${userId}/${isSuspend ? "suspend" : "unsuspend"}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      // eslint-disable-next-line no-undef
      showAlert("Success", "success"); // defined in mainScript.js
      const updatedUser = await response.json();

      button.innerHTML = `<i class="fas fa-user${
        updatedUser.active ? "-slash" : "-check"
      }"></i> ${updatedUser.active ? "Suspend User" : "Unsuspend User"}`;

      button.classList.add(updatedUser.active ? "btn-warning" : "btn-success");
      button.classList.remove(
        updatedUser.active ? "btn-success" : "btn-warning"
      );

      const activeBadge = userItem.querySelector(".badge.bg-success");
      const suspendBadge = userItem.querySelector(".badge.suspended-badge");
      button.classList.add(
        updatedUser.active ? "suspend-user-button" : "unsuspend-user-button"
      );
      button.classList.remove(
        updatedUser.active ? "unsuspend-user-button" : "suspend-user-button"
      );

      if (updatedUser.active) {
        if (suspendBadge) {
          suspendBadge.remove();
        }
        if (!activeBadge) {
          const newActiveBadge = document.createElement("span");
          newActiveBadge.classList.add("badge", "bg-success");
          newActiveBadge.textContent = "Active";
          userItem.querySelector("td:nth-child(3)").appendChild(newActiveBadge);
        }
      } else {
        if (activeBadge) {
          activeBadge.remove();
        }
        if (!suspendBadge) {
          const newSuspendBadge = document.createElement("span");
          newSuspendBadge.classList.add(
            "badge",
            "bg-danger",
            "suspended-badge"
          );
          newSuspendBadge.textContent = "Suspended";
          userItem
            .querySelector("td:nth-child(3)")
            .appendChild(newSuspendBadge);
        }
      }
    } else {
      const errorData = await response.json();
      // eslint-disable-next-line no-undef
      showAlert(errorData.errorMessage, "danger"); // defined in mainScript.js
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Enable all buttons
    // eslint-disable-next-line no-undef
    enableButtons();
  }
};

// Add click event listener to all suspend/unsuspend buttons
const suspendUnsuspendButtons = document.querySelectorAll(
  ".suspend-user-button, .unsuspend-user-button"
);
suspendUnsuspendButtons.forEach((button) => {
  button.addEventListener("click", handleSuspendUnsuspendButtonClick);
});
