// Handle Make User/Admin button click
const handleMakeButtonClick = async (event) => {
  const makeButton = event.target;
  const userBadge = makeButton.closest("tr").querySelector(".badge");
  const userId = makeButton.dataset.userId;
  const isMakeAdmin = makeButton.classList.contains("make-admin-button");

  // Disable all buttons temporarily
  // eslint-disable-next-line no-undef
  disableButtons();

  makeButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading`;

  try {
    // Perform the request after a delay of 1000 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `/api/users/${userId}/${isMakeAdmin ? "make-admin" : "make-user"}`,
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
      console.log(updatedUser);

      makeButton.innerHTML = `<i class="fas fa-user${
        updatedUser.isAdmin ? "" : "-shield"
      }"></i> ${updatedUser.isAdmin ? "Make User" : "Make Admin"}`;
      userBadge.textContent = updatedUser.isAdmin ? "Admin" : "User";

      makeButton.classList.remove(
        updatedUser.isAdmin ? "btn-primary" : "btn-secondary"
      );
      makeButton.classList.add(
        updatedUser.isAdmin ? "btn-secondary" : "btn-primary"
      );

      makeButton.classList.remove(
        updatedUser.isAdmin ? "make-admin-button" : "make-user-button"
      );
      makeButton.classList.add(
        updatedUser.isAdmin ? "make-user-button" : "make-admin-button"
      );

      userBadge.classList.remove(
        updatedUser.isAdmin ? "bg-secondary" : "bg-primary"
      );
      userBadge.classList.add(
        updatedUser.isAdmin ? "bg-primary" : "bg-secondary"
      );
    } else {
      const errorData = await response.json();
      // eslint-disable-next-line no-undef
      showAlert(errorData.errorMessage, "danger"); // defined in mainScript.js
    }
  } catch (error) {
    console.log(error);
  } finally {
    // Enable all buttons
    // eslint-disable-next-line no-undef
    enableButtons();
  }
};

// Add click event listener to all make buttons
const makeButtons = document.querySelectorAll(
  ".make-admin-button, .make-user-button"
);
makeButtons.forEach((makeButton) => {
  makeButton.addEventListener("click", handleMakeButtonClick);
});
