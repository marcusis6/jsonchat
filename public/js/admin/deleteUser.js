const handleDeleteButtonClick = (event) => {
  const deleteButton = event.target;
  const userRow = deleteButton.closest("tr");
  const userId = deleteButton.dataset.userId;

  // Display a confirm dialog using Bootstrap modal
  // eslint-disable-next-line no-undef
  const confirmModal = new bootstrap.Modal(
    document.getElementById("confirmModal")
  );
  const confirmButton = document.getElementById("confirmButton");

  // Set the user ID as a data attribute on the confirm button
  confirmButton.dataset.userId = userId;

  // Open the confirm dialog
  confirmModal.show();

  // Listen for the confirm button click event
  confirmButton.addEventListener("click", () => {
    handleConfirmDelete(confirmButton, userId, userRow, confirmModal);
  });
};

const handleConfirmDelete = async (
  confirmButton,
  userId,
  userRow,
  confirmModal
) => {
  // Disable all buttons temporarily
  // eslint-disable-next-line no-undef
  disableButtons();

  confirmButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Deleting`;

  try {
    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      confirmButton.innerHTML = `Delete`;

      confirmModal.hide();

      // Show success alert
      // eslint-disable-next-line no-undef
      showAlert("User deleted successfully", "success");

      // Remove the deleted user item from the DOM
      userRow.remove();

      confirmModal.hide();
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

const deleteButtons = document.querySelectorAll(".delete-user-button");
deleteButtons.forEach((button) => {
  button.addEventListener("click", handleDeleteButtonClick);
});
