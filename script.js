const apiKey = "EnZhGXOz1zMmnUYihSWqMbr5Pclwg2KJN1aCBnJh"; 
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const currentImageContainer = document.getElementById("current-image-container");
const searchHistory = document.getElementById("search-history");

// 🔹 When the page loads
document.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  addSearchToHistory();
});

// 🔹 Fetch and display NASA Image of the Day (current)
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      currentImageContainer.innerHTML = `<div class="error-message">Error: ${data.error.message}</div>`;
      return;
    }

    displayImage(data);
  } catch (error) {
    currentImageContainer.innerHTML = `<div class="error-message">Failed to load NASA Image of the Day.</div>`;
  }
}

// 🔹 Fetch image for selected date
async function getImageOfTheDay(date) {
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      currentImageContainer.innerHTML = `<div class="error-message">Error: ${data.error.message}</div>`;
      return;
    }

    displayImage(data);
    saveSearch(date);
    addSearchToHistory();
  } catch (error) {
    currentImageContainer.innerHTML = `<div class="error-message">Failed to load image for ${date}. Please try again.</div>`;
  }
}

// 🔹 Display the fetched image or video
function displayImage(data) {
  let mediaContent = "";

  if (data.media_type === "image") {
    mediaContent = `<img src="${data.url}" alt="${data.title}" />`;
  } else if (data.media_type === "video") {
    mediaContent = `<iframe width="560" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    mediaContent = `<p>No media available for this date.</p>`;
  }

  currentImageContainer.innerHTML = `
    <h2>${data.title}</h2>
    <p><strong>Date:</strong> ${data.date}</p>
    ${mediaContent}
    <p>${data.explanation}</p>
  `;
}

// 🔹 Save the date to localStorage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// 🔹 Display saved search history
function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searchHistory.innerHTML = "";

  searches.forEach(date => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => getImageOfTheDay(date));
    searchHistory.appendChild(li);
  });
}

// 🔹 Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedDate = input.value;
  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});
