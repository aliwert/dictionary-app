// Selecting necessary elements from the DOM
const wrapper = document.querySelector(".wrapper"); // Selecting an element with the class "wrapper"
const searchInput = wrapper.querySelector("input"); // Selecting an <input> element inside the wrapper
const volume = wrapper.querySelector(".word i"); // Selecting an <i> element inside an element with the class "word" within the wrapper
const infoText = wrapper.querySelector(".info-text"); // Selecting an element with the class "info-text" within the wrapper
const synonyms = wrapper.querySelector(".synonyms .list"); // Selecting an element with the class "list" inside an element with the class "synonyms" within the wrapper
const removeIcon = wrapper.querySelector(".search span"); // Selecting a <span> element inside an element with the class "search" within the wrapper

// Declaring a variable to store audio
let audio;

// Function to handle fetched data and display it
function data(result, word) {
  // Checking if the API returned an error
  if (result.title) {
    // If the API returns a title (indicating an error), display a message
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    // If the API returns data successfully
    // Adding 'active' class to the wrapper
    wrapper.classList.add("active");
    // Extracting data for display
    let definitions = result[0].meanings[0].definitions[0];
    let phonetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
    // Displaying word information
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    // Creating an audio element for pronunciation
    audio = new Audio("https:" + result[0].phonetics[0].audio);

    // Displaying synonyms if available
    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      // Iterating over synonyms and adding them to the list
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        // Adding onclick event to synonyms for search
        tag =
          i == 4
            ? `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`
            : tag;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}

// Function to fetch data from API
function fetchApi(word) {
  // Removing 'active' class from the wrapper
  wrapper.classList.remove("active");
  // Resetting info text color and content
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  // Constructing API URL
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  // Fetching data from API
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word)) // Passing fetched data to the data() function
    .catch(() => {
      // Handling error if unable to fetch data
      infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

// Event listener for keyup event on search input
searchInput.addEventListener("keyup", (e) => {
  // Getting the value from the input and trimming whitespace
  let word = e.target.value.trim();
  // Checking if Enter key is pressed and a word is entered
  if (e.key === "Enter" && word) {
    // Fetching data from API
    fetchApi(word);
  }
});

// Event listener for click event on volume icon
volume.addEventListener("click", () => {
  // Changing volume icon color temporarily
  volume.style.color = "#4D59FB";
  // Playing the audio pronunciation
  audio.play();
  // Restoring volume icon color after a delay
  setTimeout(() => {
    volume.style.color = "#999";
  }, 800);
});

// Event listener for click event on remove icon
removeIcon.addEventListener("click", () => {
  // Clearing search input and focusing on it
  searchInput.value = "";
  searchInput.focus();
  // Removing 'active' class from the wrapper and resetting info text color and content
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
