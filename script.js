const apiKey = "0CjQUQcaPobDfYv2JBol70ediV1chY0jISnkha6S"; // replace with your NASA API key
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const container = document.getElementById("current-image-container");
const historyList = document.getElementById("search-history");
const searchButton = document.getElementById("search-button");

// Load current image on page load
window.onload = () => {
  getCurrentImageOfTheDay(false);
  addSearchToHistory();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = input.value;
  if (!date) return;
  getImageOfTheDay(date);
  saveSearch(date);
  addSearchToHistory();
});

async function getCurrentImageOfTheDay(disableButton = true) {
  const currentDate = new Date().toISOString().split("T")[0];
  await getImageOfTheDay(currentDate, true, disableButton);
}

async function getImageOfTheDay(date, isCurrent = false, disableButton = true) {
  try {
    showLoading();
    if (disableButton)
      disableSearchButton(true);

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
    );
    if (!response.ok) throw new Error("Failed to fetch image data");

    const data = await response.json();
    displayImage(data, isCurrent);
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    if (disableButton)
      disableSearchButton(false);
  } finally {
    if (disableButton)
      disableSearchButton(false);
  }
}

function displayImage(data, isCurrent) {
  console.log("data", data);
  container.innerHTML = `
    <h2>${isCurrent ? "Today's Picture" : "Picture on " + data.date}</h2>
    <h3>${data.title}</h3>
    ${data.media_type === "image"
      ? `<img src="${data.url}" alt="${data.title}">`
      : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`
    }
    <p>${data.explanation}</p>
  `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  historyList.innerHTML = "";
  searches.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => {
      getImageOfTheDay(date);
    });
    historyList.appendChild(li);
  });
}

function showLoading() {
  container.innerHTML = `
    <div class="loader"></div>
    <p>Loading NASA image...</p>
  `;
}

function disableSearchButton(disabled) {
  searchButton.disabled = disabled;
}

