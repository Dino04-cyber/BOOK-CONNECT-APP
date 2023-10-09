import { authors, genres, books, BOOKS_PER_PAGE } from './data.js';

// Validation class adhering to SRP (Single Responsibility Principle)
class Validator {
    static validateMatchesAndPage(matches, page) {
        if (!matches || !Array.isArray(matches)) {
            throw new Error('Invalid source data');
        }

        if (!page || !Array.isArray(page) || page.length !== 2 || !page.every(num => typeof num === 'number')) {
            throw new Error('Invalid page range, should be an array with two numbers');
        }
    }
}

/**
 * Color values for day mode.
 */
const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};

/**
 * Color values for night mode.
 */
const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
};

class ThemeManager {
    static setTheme(themeConfiguration) {
        if (themeConfiguration === 'day') {
            ThemeManager.applyDayTheme();
        } else if (themeConfiguration === 'night') {
            ThemeManager.applyNightTheme();
        }
    }

    static applyDayTheme() {
        document.querySelector('body').style.setProperty('--color-dark', day.dark);
        document.querySelector('body').style.setProperty('--color-light', day.light);
    }

    static applyNightTheme() {
        document.querySelector('body').style.setProperty('--color-dark', night.dark);
        document.querySelector('body').style.setProperty('--color-light', night.light);
    }
}

class ShowMoreButtonHandler {
    static handleShowMoreClick() {
        startIndex += BOOKS_PER_PAGE;
        endIndex += BOOKS_PER_PAGE;
        this.updateBookPreviews();
    }

    static updateBookPreviews() {
        const fragment = document.createDocumentFragment();

        const numItemsToShow = Math.min(books.length - endIndex, 36);

        startIndex += numItemsToShow;
        endIndex += numItemsToShow;

        const extracted = books.slice(startIndex, endIndex);

        for (const { author, image, title, id, description, published } of extracted) {
            const preview = createBookPreview(author, image, title, id, description, published);
            fragment.appendChild(preview);
        }

        const bookList = document.querySelector('[data-list-items]');
        bookList.appendChild(fragment);

        updateShowMoreButtonText();
    }
}

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
            <img class='preview__image' src="${book.image}" alt="book pic"/>
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
        ThemeManager.setTheme('day'); // Use ThemeManager to apply the theme
        document.querySelector("[data-settings-overlay]").style.display = "none";
    }
    if (themeConfiguration.value === 'night') {
        ThemeManager.setTheme('night'); // Use ThemeManager to apply the theme
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
showMoreButton.addEventListener('click', () => {
    ShowMoreButtonHandler.handleShowMoreClick();
});

// Function to update the "Show More" button text
function updateShowMoreButtonText() {
    const numItemsToShow = Math.min(books.length - endIndex, 36);
    const showMoreButtonText = `Show More (${numItemsToShow})`;
    showMoreButton.textContent = showMoreButtonText;
}

// Initial update of the "Show More" button text
updateShowMoreButtonText();
