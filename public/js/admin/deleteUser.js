const handleUserDeleteButtonClick = (event) => {
  const deleteButton = event.target;
  const userRow = deleteButton.closest("tr");
  const userId = deleteButton.dataset.userId;

  openConfirmModal(() => {
    handleUserConfirmDelete(userId, userRow);
  });
};

const handleUserConfirmDelete = async (userId, userRow) => {
  // Disable all buttons temporarily
  disableButtons();

  // Update the confirm button with the spinner icon
  confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting';

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
      // Show success alert
      showAlertModal(
        "Success",
        "User deleted successfully",
        "success",
        true,
        3000
      );

      // Remove the deleted user item from the DOM
      userRow.remove();
    } else {
      const errorData = await response.json();
      console.log(errorData.errorMessage);
      showAlertModal("Error", "Failed to delete user", "danger", true, 5000);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Reset the confirm button's HTML content
    confirmButton.innerHTML = "Delete";

    // Enable all buttons
    enableButtons();
  }
};

const deleteButtons = document.querySelectorAll(".delete-user-button");
deleteButtons.forEach((button) => {
  button.addEventListener("click", handleUserDeleteButtonClick);
});
