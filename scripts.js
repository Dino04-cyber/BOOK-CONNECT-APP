//This imports the the const variables from the data.js file 
import {authors, genres, books , BOOKS_PER_PAGE} from './data.js' 

//Edited the two variables using const and let so it could be called properly 
const matches = books;
let page = 1;

if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!page && page.length < 2) throw new Error('Range must be an array with two numbers')

console.log(`Page ${page}`)//Checking if the pages are responding 

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}


const fragment = document.createDocumentFragment()
let startIndex = 0;
//Declared variables for number of books to be displayed when document loads
let endIndex = 36;
const extracted = books.slice(startIndex, endIndex)


// Iterates over an array called 'extracted'
for (let i = 0; i < extracted.length; i++) {
    // Create a new HTML 'dl' element and assign it to the 'preview' variable
    const preview = document.createElement('dl');
    
    // Added a class name 'preview' to the 'preview' element
    preview.className = 'preview';
    
    // Created a 'fragment' to efficiently append multiple 'preview' elements
    fragment.appendChild(preview);
    
    // Set custom data attributes on the 'preview' element using data from 'books' array
    preview.dataset.id = books[i].id;
    preview.dataset.title = books[i].title;
    preview.dataset.image = books[i].image;
    
    // Created a custom subtitle by combining the author's name and the publication year
    preview.dataset.subtitle = `${authors[books[i].author]} (${(new Date(books[i].published)).getFullYear()})`;
    
    // Set the 'description' and 'genre' custom data attributes
    preview.dataset.description = books[i].description;
    preview.dataset.genre = books[i].genres;
    
    // Set the HTML content of the 'preview' element using template literals
    preview.innerHTML = /*html*/`
        <div>
            <!-- Display an image with a class 'preview__image' -->
            <image class='preview__image' src="${books[i].image}" alt="book pic"}/>
        </div>
        <div class='preview__info'>
            <!-- Display the book title -->
            <dt class='preview__title'>${books[i].title}<dt>
            <!-- Display the author's name -->
            <dt class='preview__author'> By ${authors[books[i].author]}</dt>
        </div>`;

        //Debugging
    //console.log(preview);
    
    // Appending the 'preview' element to the 'fragment'
    fragment.appendChild(preview);
}

//The variable bookListData contains the reference to the book previews
const bookListData = document.querySelector('[data-list-items]')
bookListData.appendChild(fragment)

//SEARCH BUTTON
//The const headerSearch variable holds the reference to the search button element
const headerSearch = document.querySelector("[data-header-search]");
headerSearch.addEventListener('click', () => {
 document.querySelector("[data-search-overlay]").style.display = "block";
})

//The searchCancellation variable holds the reference to the cancel search button element
const searchCancellation = document.querySelector("[data-search-cancel]");
searchCancellation.addEventListener('click', () => {
 document.querySelector("[data-search-overlay]").style.display = "none";
})

//CODE DISPLAYS SETTINGS
//settingsOverlay variable holds a reference to the settings button element.
const settingsOverlay = document.querySelector("[data-header-settings]")
settingsOverlay.addEventListener('click', () => {
 document.querySelector("[data-settings-overlay]").style.display = "block";
})
//settingCancelOverlay variable holds a reference to the cancel settings button element.
const settingsCancelOverlay = document.querySelector('[data-settings-cancel]')
settingsCancelOverlay.addEventListener('click', () => {
document.querySelector("[data-settings-overlay]").style.display = "none";
})

//DARK AND LIGHT THEME LOGIC
//themeConfiguration variable holds a reference to the theme settings element.
const themeConfiguration = document.querySelector('[data-settings-theme]')
//saveButton variable holds a reference to the save button element.
const saveBtn = document.querySelector("body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary")


saveBtn.addEventListener('click', (event) =>{
    event.preventDefault()
  if (themeConfiguration.value === 'day') {
    document.querySelector('body').style.setProperty('--color-dark', day.dark)
    document.querySelector('body').style.setProperty('--color-light', day.light)
    document.querySelector("[data-settings-overlay]").style.display = "none";
  }
  if (themeConfiguration.value === 'night') {
    document.querySelector('body').style.setProperty('--color-dark', night.dark)
    document.querySelector('body').style.setProperty('--color-light', night.light)
    document.querySelector("[data-settings-overlay]").style.display = "none";
      }
} )


/*In this code below I attempted to create functionality for the user to be able
* to search and filter through certain books
*/
//CODE DISPLAYS THE SEARCH OPTIONS OF 'ALL GENRES' AND 'ALL AUTHORS'
//selectedAuthor: a variable that holds a reference to the select element for authors.
const selectedAuthor = document.querySelector("[data-search-authors]");
for (const authorId in authors) {
  const optionElement = document.createElement('option')
  optionElement.value = authorId
  optionElement.textContent = authors[authorId]
  selectedAuthor.appendChild(optionElement)
}
//selectedGenre: a variable that holds a reference to the select element for genres.
const selectedGenre = document.querySelector("[data-search-genres]");
for (const genreId in genres) {
  const optionElement = document.createElement('option')
  optionElement.value = genreId
  optionElement.textContent = genres[genreId]

 console.log( optionElement.value +' '+ optionElement.textContent)
  selectedGenre.appendChild(optionElement)
}

//CODE DISPLAYS THE BOOK DETAILS
//detailsToggle a function that shows the book details when a preview is clicked.
const detailsToggle = (event) => {  
    const activeListData = document.querySelector('[data-list-active]');
    const titleData = document.querySelector('[data-list-title]')
    const subtitleData = document.querySelector('[data-list-subtitle]')
    const descriptionData = document.querySelector('[data-list-description]')
    const imageData = document.querySelector('[data-list-image]')
    const imageBlurData = document.querySelector('[data-list-blur]')
    event.target.dataset.id ? activeListData.style.display = "block" : undefined;
    event.target.dataset.description ? descriptionData.innerHTML = event.target.dataset.description : undefined;
    event.target.dataset.subtitle ? subtitleData.innerHTML = event.target.dataset.subtitle : undefined;
    event.target.dataset.title ? titleData.innerHTML = event.target.dataset.title : undefined;
    event.target.dataset.image ? imageData.setAttribute ('src', event.target.dataset.image) : undefined;
    event.target.dataset.image ? imageBlurData.setAttribute ('src', event.target.dataset.image) : undefined;
};
//detailsClose a variable for the close button element for book details.
const detailsClose = document.querySelector('[data-list-close]')
detailsClose.addEventListener('click', () => {
document.querySelector("[data-list-active]").style.display = "none";
})
//bookClick: a variable  that will be clicked to show the book details.
const bookClick = document.querySelector('[data-list-items]')
bookClick.addEventListener('click', detailsToggle)

//THIS CODE DISPLAYS 'ShowMore' BUTTON 
const showMoreButton = document.querySelector('[data-list-button]')

// Changed the text of the "Show More" button to display how many more books will be displayed
const numItemsToShow = Math.min(books.length - endIndex)
const showMoreButtonText = `Show More (${numItemsToShow})`
showMoreButton.textContent = showMoreButtonText

//showMoreButton a function that adds an event listener to an element.
showMoreButton.addEventListener('click', () => {
    const numItemsToShow = (books.length - endIndex);
    showMoreButton.textContent = `Show More (${numItemsToShow})`;
    console.log(numItemsToShow)
    if (numItemsToShow > 0) {
        // Subtract 36 from 'endIndex' to show the next set of books
        endIndex += 36;
    for (const {author ,image, title, id , description, published} of extracted) {
        const preview = document.createElement('dl')
        preview.className = 'preview'
        preview.dataset.id = id
        preview.dataset.title = title
        preview.dataset.image = image
        preview.dataset.subtitle = `${authors[author]} (${(new Date(published)).getFullYear()})`
        preview.dataset.description = description
        

        preview.innerHTML= /*html*/`
        <div>
        <image class='preview__image' src="${image}" alt="book pic"}/>
        </div>
        <div class='preview__info'>
        <dt class='preview__title'>${title}<dt>
        <dt class='preview__author'> By ${authors[author]}</dt>
        </div>`
        fragment.appendChild(preview)
    }

    //bookList a variable that holds a reference to the element that will contain the book previews.
    const bookList = document.querySelector('[data-list-items]') 
    bookList.appendChild(fragment)
}})