// Function to add message actions icons to each message
const addMessageActions = (message) => {
  // Get current username
  const username = message.querySelector(".username").textContent;
  // Check if the message is sent by the current user
  const isSentByCurrentUser = username === currentUsername;

  // Create the message actions container
  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add(
    "dropdown",
    "align-self-start",
    "message-box-drop"
  );

  // Create the dropdown toggle
  const dropdownToggle = document.createElement("a");
  dropdownToggle.classList.add("dropdown-toggle");
  dropdownToggle.href = "#";
  dropdownToggle.role = "button";
  dropdownToggle.setAttribute("data-bs-toggle", "dropdown");
  dropdownToggle.setAttribute("aria-haspopup", "true");
  dropdownToggle.setAttribute("aria-expanded", "false");
  dropdownToggle.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

  // Create the dropdown menu
  const dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");
  dropdownMenu.setAttribute("data-popper-placement", "top-start");

  // Create the delete action item
  const deleteItem = document.createElement("a");
  // Create the edit action item
  const editItem = document.createElement("a");

  if (isSentByCurrentUser) {
    deleteItem.classList.add("dropdown-item");
    deleteItem.href = "#";
    deleteItem.innerHTML = 'Delete <i class="fas fa-trash"></i>';
    deleteItem.addEventListener("click", () => {
      openConfirmModal(() => {
        handleDeleteMessage(message);
      });
    });

    editItem.classList.add("dropdown-item");
    editItem.href = "#";
    editItem.innerHTML = 'Edit <i class="fas fa-edit"></i>';
    editItem.addEventListener("click", () => {
      handleEditMessage(message);
    });
  }

  // Create the reply action item
  const replyItem = document.createElement("a");
  replyItem.classList.add("dropdown-item", "reply-message");
  replyItem.href = "#";
  replyItem.setAttribute("data-bs-toggle", "collapse");
  replyItem.setAttribute("data-bs-target", ".replyCollapse");
  replyItem.innerHTML = 'Reply <i class="fas fa-reply"></i>';
  replyItem.addEventListener("click", () => {
    showReply(message);
  });

  if (isSentByCurrentUser) {
    // Append the items to the dropdown menu
    dropdownMenu.appendChild(deleteItem);
    dropdownMenu.appendChild(editItem);
  }

  dropdownMenu.appendChild(replyItem);

  // Append the toggle and menu to the actions container
  actionsContainer.appendChild(dropdownToggle);
  actionsContainer.appendChild(dropdownMenu);

  // Append the actions container to the message container
  const messageContainer = message.querySelector(".message-content");
  messageContainer.appendChild(actionsContainer);
};
