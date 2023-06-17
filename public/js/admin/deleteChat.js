const handleConfirmDeleteChat = async () => {
  // Disable all buttons temporarily
  disableButtons();

  // Update the confirm button with the spinner icon
  confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting';

  try {
    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(`/api/chat/all/delete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Show success alert
      showAlertModal(
        "Success",
        "All messages deleted successfully",
        "success",
        true,
        3000
      );
    } else {
      const errorData = await response.json();
      console.log(errorData.errorMessage);
      showAlertModal(
        "Error",
        "Failed to delete messages",
        "danger",
        true,
        5000
      );
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

const deleteButton = document.getElementById("delete-chat");
deleteButton.addEventListener("click", async (event) => {
  const deleteButton = event.target;

  openConfirmModal(() => {
    handleConfirmDeleteChat();
  });
});
