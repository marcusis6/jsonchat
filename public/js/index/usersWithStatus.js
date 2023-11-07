// Function to generate the user list HTML
const generateUserListHTML = (users) => {
  const userList = document.createElement("ul");
  userList.classList.add("user-list");

  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.classList.add("user");

    const userAvatar = document.createElement("div");
    userAvatar.classList.add("user-avatar");
    userAvatar.innerHTML = '<i class="fas fa-user"></i>';

    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");

    const userName = document.createElement("h5");
    userName.classList.add("user-name");
    userName.textContent = user.username;

    const userStatus = document.createElement("p");
    userStatus.classList.add(
      "user-status",
      user.status === "online" ? "online" : "offline"
    );
    userStatus.textContent = user.status === "online" ? "Online" : "Offline";

    const userTime = document.createElement("div");
    userTime.classList.add("user-time");

    const userConnectionTime = document.createElement("p");
    userConnectionTime.classList.add("user-connection-time");
    userConnectionTime.textContent = user.time;

    userInfo.appendChild(userName);
    userInfo.appendChild(userStatus);
    userTime.appendChild(userConnectionTime);

    userItem.appendChild(userAvatar);
    userItem.appendChild(userInfo);
    userItem.appendChild(userTime);

    userList.appendChild(userItem);
  });

  return userList;
};

// Listen for "usersWithStatus" event
socket.on("usersWithStatus", (usersWithStatus) => {
  // Get the container element
  const container = document.querySelector(".sidebar-sticky");

  // Generate the user list HTML and append it to the container
  const userListHTML = generateUserListHTML(usersWithStatus);
  container.innerHTML = "";
  container.appendChild(userListHTML);
});
