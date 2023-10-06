import { authors, genres, books, BOOKS_PER_PAGE } from './data.js';

/**
 * Validates the 'matches' and 'page' variables.
 *
 * @param {Array} matches - The 'matches' variable to validate.
 * @param {Array} page - The 'page' variable to validate.
 * @throws {Error} Throws an error if 'matches' is not an array or 'page' is not an array with two numbers.
 */
const validateMatchesAndPage = (matches, page) => {
    if (!matches || !Array.isArray(matches)) {
        throw new Error('Invalid source data');
    }

    if (!page || !Array.isArray(page) || page.length !== 2 || !page.every(num => typeof num === 'number')) {
        throw new Error('Invalid page range, should be an array with two numbers');
    }
};

/**
 * Object representing the color values for day mode.
 * @typedef {Object} DayMode
 * @property {string} dark - The dark color value for day mode in the format 'R, G, B'.
 * @property {string} light - The light color value for day mode in the format 'R, G, B'.
 */

/**
 * Object representing the color values for night mode.
 * @typedef {Object} NightMode
 * @property {string} dark - The dark color value for night mode in the format 'R, G, B'.
 * @property {string} light - The light color value for night mode in the format 'R, G, B'.
 */

/**
 * Color values for day mode.
 * @type {DayMode}
 */
const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
  };
  
  /**
   * Color values for night mode.
   * @type {NightMode}
   */
  const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
  };

// Define a Book class
class Book {
    constructor(id, title, author, image, description, published, genres) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.image = image;
        this.description = description;
        this.published = published;
        this.genres = genres;
    }

    getSubtitle() {
        return `${authors[this.author]} (${(new Date(this.published)).getFullYear()})`;
    }
}

// Create a document fragment to efficiently append elements
const fragment = document.createDocumentFragment();
let startIndex = 0;
let endIndex = 36;
const extracted = books.slice(startIndex, endIndex);

/**
 * Create a preview element for a book.
 *
 * @param {Book} book - The book object.
 * @returns {HTMLDListElement} The created preview element.
 */
const createPreviewElement = (book) => {
    const preview = document.createElement('dl');
    preview.className = 'preview';
    fragment.appendChild(preview);

    // Set custom data attributes using data from 'book'
    preview.dataset.id = book.id;
    preview.dataset.title = book.title;
    preview.dataset.image = book.image;
    preview.dataset.subtitle = book.getSubtitle();
    preview.dataset.description = book.description;
    preview.dataset.genre = book.genres;

    // Set the HTML content of the 'preview' element using template literals
    preview.innerHTML = /*html*/`
        <div>
            <image class='preview__image' src="${book.image}" alt="book pic"/>
        </div>
        <div class='preview__info'>
            <dt class='preview__title'>${book.title}</dt>
            <dt class='preview__author'> By ${authors[book.author]}</dt>
        </div>`;

    return preview;
};

// Iterate over the 'extracted' array and create preview elements
for (const bookData of extracted) {
    const book = new Book(
        bookData.id,
        bookData.title,
        bookData.author,
        bookData.image,
        bookData.description,
        bookData.published,
        bookData.genres
    );
    createPreviewElement(book);
}

// Append the 'fragment' to the book list
const bookListData = document.querySelector('[data-list-items]');
bookListData.appendChild(fragment);

// Add event listeners for search and settings buttons
const headerSearch = document.querySelector("[data-header-search]");
headerSearch.addEventListener('click', () => {
    document.querySelector("[data-search-overlay]").style.display = "block";
});

const searchCancellation = document.querySelector("[data-search-cancel]");
searchCancellation.addEventListener('click', () => {
    document.querySelector("[data-search-overlay]").style.display = "none";
});

const settingsOverlay = document.querySelector("[data-header-settings]");
settingsOverlay.addEventListener('click', () => {
    document.querySelector("[data-settings-overlay]").style.display = "block";
});

const settingsCancelOverlay = document.querySelector('[data-settings-cancel]');
settingsCancelOverlay.addEventListener('click', () => {
    document.querySelector("[data-settings-overlay]").style.display = "none";
});

// Dark and Light Theme Logic
const themeConfiguration = document.querySelector('[data-settings-theme]');
const saveBtn = document.querySelector("body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary");

saveBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (themeConfiguration.value === 'day') {
        document.querySelector('body').style.setProperty('--color-dark', day.dark);
        document.querySelector('body').style.setProperty('--color-light', day.light);
        document.querySelector("[data-settings-overlay]").style.display = "none";
    }
    if (themeConfiguration.value === 'night') {
        document.querySelector('body').style.setProperty('--color-dark', night.dark);
        document.querySelector('body').style.setProperty('--color-light', night.light);
        document.querySelector("[data-settings-overlay]").style.display = "none";
    }
});

// Code for search options of 'All Genres' and 'All Authors'
const selectedAuthor = document.querySelector("[data-search-authors]");
for (const authorId in authors) {
    const optionElement = document.createElement('option');
    optionElement.value = authorId;
    optionElement.textContent = authors[authorId];
    selectedAuthor.appendChild(optionElement);
}

const selectedGenre = document.querySelector("[data-search-genres]");
for (const genreId in genres) {
    const optionElement = document.createElement('option');
    optionElement.value = genreId;
    optionElement.textContent = genres[genreId];
    selectedGenre.appendChild(optionElement);
}

// Code to display book details
const detailsToggle = (event) => {
    const activeListData = document.querySelector('[data-list-active]');
    const titleData = document.querySelector('[data-list-title]');
    const subtitleData = document.querySelector('[data-list-subtitle]');
    const descriptionData = document.querySelector('[data-list-description]');
    const imageData = document.querySelector('[data-list-image]');
    const imageBlurData = document.querySelector('[data-list-blur]');
    event.target.dataset.id ? activeListData.style.display = "block" : undefined;
    event.target.dataset.description ? descriptionData.innerHTML = event.target.dataset.description : undefined;
    event.target.dataset.subtitle ? subtitleData.innerHTML = event.target.dataset.subtitle : undefined;
    event.target.dataset.title ? titleData.innerHTML = event.target.dataset.title : undefined;
    event.target.dataset.image ? imageData.setAttribute('src', event.target.dataset.image) : undefined;
    event.target.dataset.image ? imageBlurData.setAttribute('src', event.target.dataset.image) : undefined;
};

const detailsClose = document.querySelector('[data-list-close]');
detailsClose.addEventListener('click', () => {
    document.querySelector("[data-list-active]").style.display = "none";
});

const bookClick = document.querySelector('[data-list-items]');
bookClick.addEventListener('click', detailsToggle);

// Code to display 'Show More' button

// Select the 'Show More' button element
const showMoreButton = document.querySelector('[data-list-button]');

// Add event listener to the 'Show More' button
showMoreButton.addEventListener('click', handleShowMoreClick);

// Function to handle the 'Show More' button click event
function handleShowMoreClick() {
  const fragment = document.createDocumentFragment();

  // Calculate the number of items to show per click
  const numItemsToShow = Math.min(books.length - endIndex, 36);

  // Update the start and end indexes for slicing the books array
  startIndex += numItemsToShow;
  endIndex += numItemsToShow;

  // Extract the books within the new range
  const extracted = books.slice(startIndex, endIndex);

  // Iterate over the extracted books and create preview elements
  for (const { author, image, title, id, description, published } of extracted) {
    const preview = createBookPreview(author, image, title, id, description, published);
    fragment.appendChild(preview);
  }

  // Get the element that will contain the book previews
  const bookList = document.querySelector('[data-list-items]');

  // Append the fragment to the bookList element
  bookList.appendChild(fragment);

  // Update the "Show More" button text
  updateShowMoreButtonText();
}

// Function to create a book preview element
function createBookPreview(author, image, title, id, description, published) {
  const preview = document.createElement('dl');
  preview.className = 'preview';
  preview.dataset.id = id;
  preview.dataset.title = title;
  preview.dataset.image = image;
  preview.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
  preview.dataset.description = description;

  preview.innerHTML = /*html*/ `
    <div>
      <img class='preview__image' src="${image}" alt="book pic">
    </div>
    <div class='preview__info'>
      <dt class='preview__title'>${title}</dt>
      <dt class='preview__author'>By ${authors[author]}</dt>
    </div>`;

  return preview;
}

// Function to update the "Show More" button text
function updateShowMoreButtonText() {
  const numItemsToShow = Math.min(books.length - endIndex, 36);
  const showMoreButtonText = `Show More (${numItemsToShow})`;
  showMoreButton.textContent = showMoreButtonText;
}
