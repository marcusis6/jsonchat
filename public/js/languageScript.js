// This is for index page language selector selected lang for logged in user.
const lang = document?.getElementById("langPref")?.textContent;
console.log(lang);
if (lang === "en") {
  document.getElementById("selectedLanguage").textContent = "English";
} else if (lang === "bn") {
  document.getElementById("selectedLanguage").textContent = "বাংলা";
}

// This is for index page language selector
function selectLanguage(language) {
  console.log(language);
  document.getElementById("selectedLanguage").textContent = language;

  // Add additional functionality based on the selected language
  if (language === "বাংলা") {
    // Code for Bengali language
    LoadLanguage("bn");
    // Add your logic here for Bengali language
  } else if (language === "English") {
    // Code for English language
    LoadLanguage("en");
    // Add your logic here for English language
  } else {
    // Code for other languages
    console.log("Selected language is not supported");
    // Add your logic here for other languages
  }
}

// Initialize the Bootstrap dropdown component for language selection
document.addEventListener("DOMContentLoaded", function () {
  var languageDropdownToggle = document.getElementById(
    "languageDropdownToggle"
  );
  var languageDropdown = document.getElementById("languageDropdown");

  languageDropdownToggle.addEventListener("click", function () {
    languageDropdown.classList.toggle("show");
  });

  window.addEventListener("click", function (event) {
    if (
      !event.target.matches("#languageDropdownToggle") &&
      !event.target.matches("#languageDropdown") &&
      !event.target.matches(".dropdown-item")
    ) {
      languageDropdown.classList.remove("show");
    }
  });
});

// Changes the URL with the selected language as a query parameter
// Redirects to the new URL
function LoadLanguage(lang) {
  const url = new URL(window.location.href); // Get the current URL
  url.searchParams.set("lang", lang); // Set the language as a query parameter
  window.location.href = url.href; // Redirect to the new URL
}

// Add event listener to language select dropdown
// This is for login and registration page lang selector sss
// const langSelect = document.getElementById("lang-select");
// langSelect.addEventListener("change", function () {
//   const lang = langSelect.value; // Get the selected language
//   LoadLanguage(lang);
// });
