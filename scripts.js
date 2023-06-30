import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js"; //Imported variables from the data.js file

let matches = books;          //The matches variable is linked with the books array meaning it contains the entire book list
let page = 1;                //The page variable is initialized with the value 1, indicating the current page.
const range = [0, 35];       //indicates that the books are 36, the array will start to count from 0-35

if (!books || !Array.isArray(books)) {          //checks if the book variable is present and an array if not it will throws ana error
  throw new Error('Source required');
}

if (!range || range.length < 2) {
  throw new Error('Range must be an array with two numbers');     //checks if the range variable is present and and has the mentioned values if not it throws an error
}

const day = {
  dark: '10, 10, 20',
  light: '255, 255, 255',            // day and night are for the theme of the webapp
};

const night = {
  dark: '255, 255, 255',
  light: '10, 10, 20',
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);; //...........extract a portion of an array and return a new array containing the extracted elements.......

//author, image, and title properties are assigned to the dataOfBooks object and assigns them to variables with the same names
function createPreview(dataOfBooks) {
  const { author, image, title } = dataOfBooks;

  const preview = document.createElement('books');
  preview.classList.add('preview');

  const previewImage = document.createElement('img');
  previewImage.src = image;
  preview.appendChild(previewImage);

  const previewTitle = document.createElement('h1');
  previewTitle.textContent = title;
  preview.appendChild(previewTitle);

  const previewAuthor = document.createElement('h4');
  previewAuthor.textContent = authors[author];
  preview.appendChild(previewAuthor);
  return preview;
}

//createPreviewFragment function is defined with three parameters: data, start, and end
//Creates a new document fragment to store the preview elements.
//repeat over the data array specified by the start and end
//Calls the createPreview function with an object containing the extracted properties as arguments.
function createPreviewFragment(data, start, end) {
  const fragment = document.createDocumentFragment();

  for (let i = start; i < end && i < data.length; i++) {
    const { author, image, title, id } = data[i];

    const preview = createPreview({
      author,
      id,
      image,
      title
    });

    fragment.appendChild(preview);
  }

  return fragment;
}

//loop that repetition over the matches array
//Destructures the author, image, title, and id properties from the current element
for (let i = 0; i < extracted.length; i++) {
  const { author, image, title, id } = extracted[i];

  const preview = createPreview({
    author,
    id,
    image,
    title
  });

  fragment.appendChild(preview);
}

document.querySelector('[data-list-items]').appendChild(fragment);    //adds the generated fragment, which contains preview elements, to the selected element in the code

const genresFragment = document.createDocumentFragment();        //create a dropdown menu for genres, where the "All Genres" option is the first option in the list
let element = document.createElement('option'); 
element.value = 'any';
element.innerText = 'All Genres';
genresFragment.appendChild(element);

for (const [id, name] of Object.entries(genres)) {       //For each entry, it creates an option element and assigns the id and name values to the value and inner text content respectively
  element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  genresFragment.appendChild(element);
}

//.....used to activate the Search button...............

document.querySelector('[data-search-genres]').appendChild(genresFragment);

const authorsFragment = document.createDocumentFragment();
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authorsFragment.appendChild(element);

for (const [id, name] of Object.entries(authors)) {
  element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  authorsFragment.appendChild(element);
}

document.querySelector('[data-search-authors]').appendChild(authorsFragment);

//..........day and night Theme................

const v = document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty('--color-dark', css[v].dark);
  document.documentElement.style.setProperty('--color-light', css[v].light);
  document.querySelector('[data-settings-overlay]').open = false;
});

//update the button's text, disabled state, and HTML content

document.querySelector('[data-list-button]').textContent = `Show more (${Math.max(0, matches.length - page * BOOKS_PER_PAGE)})`;
document.querySelector('[data-list-button]').disabled === !(matches.length - page * BOOKS_PER_PAGE > 0);
document.querySelector('[data-list-button]').innerHTML = `
  <span>Show more</span>
  <span class="list__remaining">(${Math.max(0, matches.length - page * BOOKS_PER_PAGE)})</span>
`;

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
  if (!document.querySelector('[data-search-overlay]').showModal()) {
    // Handle the click event
  }
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
  if (!document.querySelector('[data-settings-overlay]').showModal().open()) {
    // Handle the click event
  }
});

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  // Handle the form submission
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
  if (!document.querySelector('[data-list-active]').showModal().open()) {
    // Handle the click event
  }
});

//calculates the start and end indices for the portion of the matches array to display based on the current page and the number of books per page
document.querySelector('[data-list-button]').addEventListener('click', () => {
  const start = page * BOOKS_PER_PAGE;
  const end = (page + 1) * BOOKS_PER_PAGE;
  const fragment = createPreviewFragment(matches, start, end);
  document.querySelector('[data-list-items]').appendChild(fragment);
  document.querySelector('[data-list-button]').textContent = `Show more (${Math.max(0, matches.length - (page + 1) * BOOKS_PER_PAGE)})`;
  document.querySelector('[data-list-button]').disabled = !(matches.length - (page + 1) * BOOKS_PER_PAGE > 0);
  page++;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {    // from here
  if (document.querySelector('[data-search-overlay]').showModal()) {
    document.querySelector('[data-search-title]').focus();
  }
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').close();
   });
                                                                                       //until here its the search button

//this code handles the click events on the settings-related elements.
//When data-header-settings is clicked, it shows the settings overlay and focuses on a specific element data-settings-theme
//When data-settings-cance is clicked, it closes or hides the settings overlay.

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    if (document.querySelector('[data-settings-overlay]').showModal()) {
      document.querySelector('[data-settings-theme]').focus();
    }
  });

  document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').close();
   });

document.querySelector('[data-search-form]').addEventListener('submit', (event) => { //code for the data drach form
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

//this code applies filters to the books array and creates a result array containing the books that match the specified criteria

  for (const book of books) {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    let genreMatch = false;

    if (filters.genre === 'any') {
      genreMatch = true;
    } else {
      for (const genre of book.genres) {
        if (genre === filters.genre) {
          genreMatch = true;
          break;
        }
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }

  if (result.length < 1) {
    document.querySelector('[data-list-message]').classList.add('list__message');
  } else {
    document.querySelector('[data-list-message]').classList.remove('list__message');
  }

  //this code updates the list of items displayed, updates the state and content of the "Show more" button 
  //based on the number of remaining items, scrolls the window to the top, and closes the search overlay
  
  document.querySelector('[data-list-items]').innerHTML = '';
  const fragment = createPreviewFragment(result, range[0], range[1]);
  document.querySelector('[data-list-items]').appendChild(fragment);
  const initial = Math.max(0, result.length - page * BOOKS_PER_PAGE);
  const remaining = result.length > page * BOOKS_PER_PAGE ? initial : 0;

  document.querySelector('[data-list-button]').disabled = initial > 0;

  document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining">(${remaining})</span>
  `;

  window.scrollTo(0, 0);
  document.querySelector('[data-search-overlay]').open() = false;
});

// this code handles the click event on the data-list-items element and its descendants
//It looks for a clicked element with a dataset.preview attribute
//matches it with a book from the 'books' array, and updates various elements 
//in the DOM to display the details of the selected book
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    const previewId = node?.dataset?.preview;

    for (const singleBook of books) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }

    if (active) {
      break;
    }
  }

  if (!active) {
    return;
  }

  document.querySelector('[data-list-active]').showModal();
document.querySelector('[data-list-blur]').src = active.image;
document.querySelector('[data-list-title]').textContent = active.title;
document.querySelector('[data-list-subtitle]').textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
document.querySelector('[data-list-description]').textContent = active.description;

});

