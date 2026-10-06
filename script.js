// Get elements from the HTML
const form = document.querySelector(".search-form");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const clearButton = document.getElementById("clearButton");

// Listen for the form submission
form.addEventListener("submit", async (event) => {
    // Prevent the page from reloading
    event.preventDefault();

    // Get the user's search query
    const query = input.value.trim();

    // Ignore empty searches
    if (!query) {
        return;
    }

    // Build the Wikimedia Commons API URL
    const url =
        "https://commons.wikimedia.org/w/api.php?action=query" +
        "&generator=search" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&gsrnamespace=6" +
        "&gsrlimit=12" +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=300" +
        "&format=json" +
        "&origin=*";

    // Fetch the API data
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
        throw new Error(response.status);
    }

    // Convert the response to JavaScript data
    const data = await response.json();

    // Get the image results
    const items = Object.values(data.query?.pages || {});

    // Clear previous results
    results.innerHTML = "";

    // Hide the empty state
    emptyState.style.display = "none";

    // Show the number of results
    resultCount.textContent =
        `Showing ${items.length} results for "${query}"`;

    // Create a card for every image
    items.forEach((item) => {

        // Create the card
        const card = document.createElement("article");
        card.className = "card";

        // Create the image
        const img = document.createElement("img");
        img.src = item.imageinfo[0].thumburl;
        img.alt = item.title;

        // Create the caption
        const caption = document.createElement("p");
        caption.textContent = item.title;

        // Add image to card
        card.appendChild(img);

        // Add caption to card
        card.appendChild(caption);

        // Add card to results grid
        results.appendChild(card);
    });
});

// Clear button
clearButton.addEventListener("click", () => {
    results.innerHTML = "";

    resultCount.textContent = "Results will appear here";

    emptyState.style.display = "block";
});