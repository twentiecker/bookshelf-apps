// Kriteria 1: Mampu Menambahkan Data Buku (v)
// Kriteria 2: Memiliki Dua Rak Buku (v)
// Kriteria 3: Dapat Memindahkan Buku antar Rak (v) 
// Kriteria 4: Dapat Menghapus Data Buku (v)
// Kriteria 5: Manfaatkan localStorage dalam Menyimpan Data Buku (v)
// Optional 1: Tambahkan fitur pencarian untuk mem-filter buku yang ditampilkan pada rak sesuai dengan title buku yang dituliskan pada kolom pencarian
// Optional 2: Berkreasilah dengan membuat proyek Bookshelf Apps tanpa menggunakan project starter
// Optional 3: Menuliskan kode dengan bersih (v)
// Optional 4: Terdapat improvisasi fitur seperti (pilih satu): Custom Dialog ketika menghapus buku dan Dapat meng-edit buku

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const bookSubmitStats = document.getElementById('bookSubmitStats');

document.getElementById('inputBookIsComplete').addEventListener('click', function () {
  if (document.getElementById('inputBookIsComplete').checked) {
    bookSubmitStats.innerText = 'Selesai dibaca';
  } else {
    bookSubmitStats.innerText = 'Belum selesai dibaca';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  
  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
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
  
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar('Buku berhasil ditambahkan');
}

function makeBook(bookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis: ' + bookObject.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun: ' + bookObject.year;

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(bookTitle, bookAuthor, bookYear, actionContainer);
  container.classList.add('book_item');
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = 'Belum selesai dibaca';

      undoButton.addEventListener('click', function () {
          undoBookFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
          removeBookFromCompleted(bookObject.id);
      });

      actionContainer.appendChild(undoButton);
      actionContainer.appendChild(trashButton);
  } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = 'Selesai dibaca';

      checkButton.addEventListener('click', function () {
          addBookToCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
          removeBookFromCompleted(bookObject.id);
      });

      actionContainer.appendChild(checkButton);
      actionContainer.appendChild(trashButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of books) {
      const bookElement = makeBook(bookItem)
      if (!bookItem.isComplete) {
        incompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
  }
});

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) {
      return;
  }

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar('Boku telah selesai dibaca');
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
  snackbar('Buku belum selesai dibaca');
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  
  if (bookTarget === -1) {
      return;
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  snackbar('Buku berhasil dihapus');
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId); // find index of an object from array
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

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

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

function snackbar(message) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

  // Write a message
  x.innerText = message;
}