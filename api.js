// Initial URL
const url_api = "https://rickandmortyapi.com/api/character";

// Control simultaneous requests
let isLoading = false;

// Store original characters
let originalCharacters = [];

/**
 * requestData
 * Makes API request
 * @param {string} url
 */
async function requestData(url) {

    // Prevent multiple requests
    if (isLoading) {
        return;
    }

    // Lock requests
    isLoading = true;

    const response = await axios.get(url);

    // Axios stores data in response.data
    let data = response.data;

    // Store original characters
    originalCharacters = data.results;

    // Reset filter
    document.getElementById("genderFilter").value = "all";

    // Update page number
    updatePageNumber(url, data.info.pages);

    // Update buttons
    updateButtons(data.info);

    // Render characters
    renderHtml(originalCharacters);

    // Release lock
    isLoading = false;
}

/**
 * updatePageNumber
 * Updates page number
 * @param {string} url
 */
function updatePageNumber(url, lastPage) {

    let page = 1;

    // Search ?page= parameter
    if (url.includes("page=")) {

        let params = new URLSearchParams(url.split("?")[1]);
        page = params.get("page");
    }

    document.getElementById("pageNumber").innerText =
        `Page ${page} of ${lastPage}`;
}

/**
 * updateButtons
 * Updates data-next and data-prev
 * @param {object} info
 */
function updateButtons(info) {

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    // Store next page
    nextBtn.setAttribute(
        "data-next",
        (info.next == null) ? "" : info.next
    );

    // Store previous page
    prevBtn.setAttribute(
        "data-prev",
        (info.prev == null) ? "" : info.prev
    );

    // Disable buttons
    nextBtn.disabled = (info.next == null);
    prevBtn.disabled = (info.prev == null);
}

/**
 * nextPage
 * Go to next page
 */
function nextPage() {

    const nextBtn = document.getElementById("nextBtn");

    const next = nextBtn.getAttribute("data-next");

    if (next != "") {
        requestData(next);
    }
}

/**
 * prevPage
 * Go to previous page
 */
function prevPage() {

    const prevBtn = document.getElementById("prevBtn");

    const prev = prevBtn.getAttribute("data-prev");

    if (prev != "") {
        requestData(prev);
    }
}

/**
 * filterCharacters
 * Filters characters by gender
 */
function filterCharacters() {

    const filterValue =
        document.getElementById("genderFilter").value;

    // Show all characters
    if (filterValue == "all") {

        renderHtml(originalCharacters);

        return;
    }

    // Filter characters
    let filteredCharacters =
        originalCharacters.filter(function(character) {

            return character.gender == filterValue;
        });

    renderHtml(filteredCharacters);
}

/**
 * renderHtml
 * Renders characters
 * @param {array} characters
 */
function renderHtml(characters) {

    let element = document.getElementById("character");

    // Variable to store HTML
    let template = "";

    let resultCount = characters.length;

    for (let index = 0; index < resultCount; index++) {

        let character = characters[index];

        template += `
            <li>
                <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <span>${character.gender}</span>
            </li>
        `;
    }

    // Replace all content
    element.innerHTML = template;
}

// Initial load
requestData(url_api);