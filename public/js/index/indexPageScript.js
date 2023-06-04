// Sidebar toggle functionality
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarWrapper = document.getElementById("sidebar_wrapper");
const mainSection = document.querySelector(".main-section");

sidebarToggle.addEventListener("click", function () {
  this.classList.toggle("active"); // Toggle the active class on the sidebar toggle button
  const isActive = this.classList.contains("active"); // Check if the sidebar toggle button is active

  // Toggle the sidebar display based on the active state
  sidebarWrapper.style.display = isActive ? "" : "none";

  // Toggle the div classes on the main section based on the active state
  mainSection.classList.remove("col-md-9", "col-lg-10");
  mainSection.classList.add(
    isActive ? "col-md-9" : "col-md-12",
    isActive ? "col-lg-10" : "col-lg-12"
  );
});

// Header toggle functionality
const headerToggle = document.getElementById("header-toggle");
const navbar = document.querySelector(".navbar");

headerToggle.addEventListener("click", function () {
  this.classList.toggle("active"); // Toggle the active class on the header toggle button
  const isActive = this.classList.contains("active"); // Check if the header toggle button is active

  // Toggle the navbar display based on the active state
  navbar.style.display = isActive ? "" : "none";

  const elem = document.querySelector(".main-section");
  // Toggle the padding property of the main section based on the active state
  elem.style.setProperty(
    "padding",
    isActive ? "48px 24px 0px" : "0px 24px 0px",
    "important"
  );
  elem.style.removeProperty("top"); // Remove the 'top' property
});

// Auto expand the textarea
document.body.addEventListener("keydown", handleTextareaResize);
document.body.addEventListener("input", handleTextareaResize);

function handleTextareaResize(event) {
  const target = event.target;
  // Check if the target element is a textarea with the attribute data-expandable
  if (target.matches("textarea[data-expandable]")) {
    // Reset the height to auto to allow the textarea to shrink if needed
    target.style.height = "auto";
    // Set the height of the textarea to match its scroll height, expanding it if necessary
    target.style.height = target.scrollHeight + "px";
  }
}

const button = document.querySelector("#emoji-button");

// eslint-disable-next-line no-undef
const picker = new EmojiButton({ zIndex: 100000 });
picker.on("emoji", (emoji) => {
  document.querySelector("textarea#message").value += emoji;
});
button.addEventListener("click", () => {
  picker.togglePicker(button);
});
