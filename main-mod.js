// Kriteria 1: Mampu Menambahkan Data Buku (v)
// Kriteria 2: Memiliki Dua Rak Buku (v)
// Kriteria 3: Dapat Memindahkan Buku antar Rak (v) 
// Kriteria 4: Dapat Menghapus Data Buku (v)
// Kriteria 5: Manfaatkan localStorage dalam Menyimpan Data Buku (v)
// Optional 1: Tambahkan fitur pencarian untuk mem-filter buku yang ditampilkan pada rak sesuai dengan title buku yang dituliskan pada kolom pencarian (v)
// Optional 2: Berkreasilah dengan membuat proyek Bookshelf Apps tanpa menggunakan project starter (v)
// Optional 3: Menuliskan kode dengan bersih (v)
// Optional 4: Terdapat improvisasi fitur seperti (pilih satu): Custom Dialog ketika menghapus buku atau Dapat meng-edit buku (v)

const books = [];
let searchBooks = [];
let flagSearchBooks = false;
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const bookSubmitStats = document.getElementById('bookSubmitStats');

document.getElementById('inputBookIsComplete').addEventListener('click', function () {
  if (document.getElementById('inputBookIsComplete').checked) {
    bookSubmitStats.innerHTML = '<b>"Finished reading"</b>';
  } else {
    bookSubmitStats.innerHTML = '<b>"Unfinished reading"</b>';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  const searchForm = document.getElementById('searchBook');
  
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchBookTitle = document.getElementById('searchBookTitle').value;
    const na1 = naContent();
    const na2 = naContent();

    if (searchBookTitle != '') {
      flagSearchBooks = true;
      searchBook(searchBookTitle);
      
      const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
      incompleteBookshelfList.innerHTML = '';
      incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-3', 'row-cols-lg-12');
      incompleteBookshelfList.append(na1);

      const completeBookshelfList = document.getElementById('completeBookshelfList');
      completeBookshelfList.innerHTML = '';
      completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-3', 'row-cols-lg-12');
      completeBookshelfList.append(na2);

      if (searchBooks.some((book) => book.isComplete === false)) {
        incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
        incompleteBookshelfList.innerHTML = '';        
      }
  
      if (searchBooks.some((book) => book.isComplete === true)) {
        completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
        completeBookshelfList.innerHTML = '';        
      }

      for (const bookItem of searchBooks) {
        const bookElement = makeBook(bookItem)
        if (!bookItem.isComplete) {
          incompleteBookshelfList.append(bookElement);
        } else {
          completeBookshelfList.append(bookElement);
        }
      }

      if (searchBooks.length == 0) {
        liveToast('Books containing the word <b>"' + searchBookTitle + '"</b> are not found');        
      } else {
        liveToast('Books containing the word <b>"' + searchBookTitle + '"</b> have been found');
      }
    } else {
      searchBooks = [];
      flagSearchBooks = false;

      incompleteBookshelfList.innerHTML = '';
      incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-3', 'row-cols-lg-12');
      incompleteBookshelfList.append(na1);

      completeBookshelfList.innerHTML = '';
      completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-3', 'row-cols-lg-12');
      completeBookshelfList.append(na2);

      if (books.some((book) => book.isComplete === false)) {
        incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
        incompleteBookshelfList.innerHTML = '';        
      }
  
      if (books.some((book) => book.isComplete === true)) {
        completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
        completeBookshelfList.innerHTML = '';        
      }
      
      for (const bookItem of books) {
        const bookElement = makeBook(bookItem)
        if (!bookItem.isComplete) {
          incompleteBookshelfList.append(bookElement);
        } else {
          completeBookshelfList.append(bookElement);
        }
      }

      liveToast('All books have been displayed on the shelf below');
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,  
  };
}

function generateId() {
  return +new Date();
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = parseInt(document.getElementById('inputBookYear').value);
  const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
  const searchBookTitle = document.getElementById('searchBookTitle').value; 

  if (!flagSearchBooks) {
    document.getElementById('searchBookTitle').value = '';
  }
  
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  if (bookTitle.includes(searchBookTitle) && searchBookTitle != '' && flagSearchBooks) {
    searchBooks.push(bookObject);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  resetForm();
  liveToast('The book of <b>"' + bookTitle + '"</b> has been successfully inserted');
}

function resetForm() {
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;
  document.getElementById('bookSubmitStats').innerHTML = '<b>"Unfinished reading"</b>';
  document.getElementById('inputBookTitle').focus();
}

function makeBook(bookObject) {
  const bookTitle = document.createElement('h5');
  bookTitle.innerText = bookObject.title;
  bookTitle.classList.add('card-title');

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Author: ' + bookObject.author;
  bookAuthor.classList.add('card-text');

  const bookYear = document.createElement('small');
  bookYear.innerText = 'Year: ' + bookObject.year;
  bookYear.classList.add('text-muted');

  const containerBookYear = document.createElement('p');
  containerBookYear.classList.add('card-text');
  containerBookYear.appendChild(bookYear);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('col-md-5');
  imgContainer.classList.add('mt-2');

  if (bookObject.isComplete) {
    const imageBook = document.createElement('img');
    imageBook.setAttribute('src', 'assets/light-green-book.png');
    imageBook.classList.add('rounded');
    imageBook.setAttribute('width', '156px');
    imageBook.setAttribute('height', '175px');

    imgContainer.append(imageBook);

    const undoButton = document.createElement('button');
    undoButton.classList.add('btn');
    undoButton.classList.add('btn-outline-success');
    undoButton.classList.add('bi');
    undoButton.classList.add('bi-arrow-counterclockwise');
    
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('btn');
    trashButton.classList.add('btn-outline-danger');
    trashButton.classList.add('bi');
    trashButton.classList.add('bi-trash2-fill');
    trashButton.classList.add('ml-2');

    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });

    actionContainer.appendChild(undoButton);
    actionContainer.appendChild(trashButton);
  } else {
    const imageBook = document.createElement('img');
    imageBook.setAttribute('src', 'assets/cyan-book.png');
    imageBook.classList.add('rounded');
    imageBook.setAttribute('width', '156px');
    imageBook.setAttribute('height', '175px');

    imgContainer.append(imageBook);

    const checkButton = document.createElement('button');
    checkButton.classList.add('btn');
    checkButton.classList.add('btn-outline-primary');
    checkButton.classList.add('bi');
    checkButton.classList.add('bi-check-lg');

    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('btn');
    trashButton.classList.add('btn-outline-danger');
    trashButton.classList.add('bi');
    trashButton.classList.add('bi-trash2-fill');
    trashButton.classList.add('ml-2');

    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });

    actionContainer.appendChild(checkButton);
    actionContainer.appendChild(trashButton);
  }

  const card = document.createElement('div');
  card.classList.add('card-body');
  card.append(bookTitle, bookAuthor, containerBookYear, actionContainer);
  
  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.classList.add('col-md-7');
  cardBodyContainer.append(card);

  const guttersContainer = document.createElement('div');
  guttersContainer.classList.add('row');
  guttersContainer.classList.add('no-gutters');
  guttersContainer.append(imgContainer, cardBodyContainer);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card');
  cardContainer.classList.add('mb-3');
  cardContainer.classList.add('mt-3');
  cardContainer.classList.add('shadow');
  cardContainer.classList.add('bg-white');
  cardContainer.classList.add('rounded');
  cardContainer.append(guttersContainer);
  
  const container = document.createElement('div');
  container.classList.add('col');
  container.classList.add('mb-4');
  container.append(cardContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const na1 = naContent();
  const na2 = naContent();
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';
  incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-3', 'row-cols-lg-12');
  incompleteBookshelfList.append(na1);

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';
  completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-3', 'row-cols-lg-12');
  completeBookshelfList.append(na2);

  if (searchBooks.length == 0 && document.getElementById('searchBookTitle').value == '' && books.length != 0) {
    if (books.some((book) => book.isComplete === false)) {
      incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
      incompleteBookshelfList.innerHTML = '';        
    }

    if (books.some((book) => book.isComplete === true)) {
      completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
      completeBookshelfList.innerHTML = '';        
    }
    
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        incompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
    }  
  } else {
    if (searchBooks.some((book) => book.isComplete === false)) {
      incompleteBookshelfList.className = incompleteBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
      incompleteBookshelfList.innerHTML = '';        
    }

    if (searchBooks.some((book) => book.isComplete === true)) {
      completeBookshelfList.className = completeBookshelfList.className.replace('row-cols-lg-12', 'row-cols-lg-3');
      completeBookshelfList.innerHTML = '';        
    }

    for (const bookItem of searchBooks) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        incompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
    }  
  }
});

function naContent() {
  const naText = document.createElement('h5');
  naText.innerText = 'Data not available';

  const naTextDiv = document.createElement('div');
  naTextDiv.classList.add('text-center');
  naTextDiv.appendChild(naText);

  const naImage = document.createElement('img');
  naImage.setAttribute('src', 'assets/undraw_No_data_re_kwbl.png');
  naImage.classList.add('img-fluid');
  naImage.setAttribute('width', '30%');

  const naContainer = document.createElement('div');
  naContainer.classList.add('text-center');
  naContainer.append(naImage, naTextDiv);

  return naContainer;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) {
    return;
  }

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  liveToast('The book of <b>"' + bookTarget.title + '"</b> has finished reading');
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }

  return null;
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) {
    return;
  }

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  liveToast('The book of <b>"' + bookTarget.title + '"</b> is not finished reading');
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) {
    return;
  }
  liveToast('The book of <b>"' + books[bookTarget].title + '"</b> have been successfully deleted');
  books.splice(bookTarget, 1);

  if (searchBooks.length != 0) {
    const searchBookTarget = findSearchBookIndex(bookId);
    if (searchBookTarget === -1) {
      return;
    }
    searchBooks.splice(searchBookTarget, 1);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId); // find index of an object from array
}

function findSearchBookIndex(bookId) {
  return searchBooks.findIndex((book) => book.id === bookId); // find index of an object from array
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof(Storage) === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }

  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook(searchBookTitle) {
  searchBooks = [];
  for (const book of books) {
    if (book.title.includes(searchBookTitle)) {
      searchBooks.push(book);
    }
  }
}

function liveToast(message) {
  const toastShow = document.getElementById('liveToast');
  toastShow.className = 'toast show';
  
  const toastMsg = document.querySelector('.toast-body');
  toastMsg.innerHTML = message;

  setTimeout(function() { toastShow.className = toastShow.className.replace('toast show', 'toast hide'); }, 3000);
}