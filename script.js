AOS.init({ duration: 800, once: true })
feather.replace();

// Book Constructor
function Book(title, author, pages, genre, read, coverUrl = '', id = crypto.randomUUID()) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.read = read; // Can be 'unread', 'reading', or 'read'
    this.coverUrl = coverUrl;
}

// Library array
const myLibrary = [];

// DOM elements
const booksContainer = document.getElementById('booksContainer');
const addBookBtn = document.getElementById('addBookBtn');
const bookDialog = document.getElementById('bookDialog');
const bookForm = document.getElementById('bookForm');
const cancelBtn = document.getElementById('cancelBtn');
const emptyState = document.getElementById('emptyState');

// Stats elements
const totalBooksEl = document.getElementById('totalBooks');
const readBooksEl = document.getElementById('readBooks');
const readingBooksEl = document.getElementById('readingBooks');
const unreadBooksEl = document.getElementById('unreadBooks');

// Add book to library
function addBookToLibrary(title, author, pages, genre, status, coverUrl = '') {
    const newBook = new Book(title, author, pages, genre, status, coverUrl);
    myLibrary.push(newBook);
    saveLibraryToLocalStorage();
    displayBooks();
    updateStats();
}

// Remove book from library
function removeBookFromLibrary(id) {
    const index = myLibrary.findIndex(book => book.id === id);
    if (index !== -1) {
        myLibrary.splice(index, 1);
        saveLibraryToLocalStorage();
        displayBooks();
        updateStats();
    }
}

// Update book status
function updateBookStatus(id, status) {
    const book = myLibrary.find(book => book.id === id);
    if (book) {
        const prevStatus = book.read;
        book.read = status;
        saveLibraryToLocalStorage();
        displayBooks();
        updateStats();
    }
}

// Save library to localStorage
function saveLibraryToLocalStorage() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Load library from localStorage
function loadLibraryFromLocalStorage() {
    const stored = localStorage.getItem('myLibrary');
    if (stored) {
        const parsed = JSON.parse(stored);
        parsed.forEach(bookData => {
            const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.genre, bookData.read, bookData.coverUrl, bookData.id);
            myLibrary.push(book);
        });
    }
}

// Update total stats
function updateStats() {
    const total = myLibrary.length;
    const read = myLibrary.filter(book => book.read === 'read').length;
    const reading = myLibrary.filter(book => book.read === 'reading').length;
    const unread = myLibrary.filter(book => book.read === 'unread').length;

    totalBooksEl.textContent = total;
    readBooksEl.textContent = read;
    readingBooksEl.textContent = reading;
    unreadBooksEl.textContent = unread;
}

// Display all books
function displayBooks() {
    booksContainer.innerHTML = '';
    
    if (myLibrary.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    myLibrary.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card glass-effect rounded-xl p-6 text-white';
        bookCard.setAttribute('data-aos', 'fade-up');
        bookCard.setAttribute('data-aos-delay', index * 100);
        
        bookCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <span class="px-3 py-1 bg-gray-200 bg-opacity-20 rounded-full text-sm font-medium">
                    ${book.genre}
                </span>
                <button onclick="removeBookFromLibrary('${book.id}')" 
                        class="text-red-300 hover:text-red-500 transition duration-200"
                        title="Remove book">
                    <i data-feather="x-circle" class="w-6 h-6"></i>
                </button>
            </div>
            
            ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title} cover" class="w-full h-48 object-cover rounded-lg mb-4">` : `<img src="" alt="${book.title} cover" class="w-full h-48 object-cover rounded-lg mb-4">`}
            
            <h3 class="text-xl font-bold mb-2 line-clamp-2">${book.title}</h3>
            <p class="text-base mb-4">by ${book.author}</p>
            
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm">
                    <i data-feather="file-text" class="inline w-4 h-4 mr-1"></i>
                    ${book.pages} pages
                </span>
            </div>
            
            <select onchange="updateBookStatus('${book.id}', this.value)" 
                class="read-status w-full py-3 rounded-lg font-semibold transition duration-300 bg-opacity-80 ${book.read === 'read' ? 'bg-green-500' : book.read === 'reading' ? 'bg-yellow-500' : 'bg-gray-500'}">
                <option value="unread" ${book.read === 'unread' ? 'selected' : ''}>🔖 Planning to Read</option>
                <option value="reading" ${book.read === 'reading' ? 'selected' : ''}>📖 Currently Reading</option>
                <option value="read" ${book.read === 'read' ? 'selected' : ''}>📘 Finished Reading</option>
            </select>
        `;
        
        booksContainer.appendChild(bookCard);
    });
    
    feather.replace();
}

// Event listeners
addBookBtn.addEventListener('click', () => {
    bookDialog.showModal();
});

cancelBtn.addEventListener('click', () => {
    bookDialog.close();
    bookForm.reset();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('pages').value);
    const coverUrl = document.getElementById('coverUrl').value;
    const genre = document.getElementById('genre').value;
    const status = document.getElementById('status').value;
    
    addBookToLibrary(title, author, pages, genre, status, coverUrl);
    bookDialog.close();
    bookForm.reset();
});

// Initialize the library
loadLibraryFromLocalStorage();
if (myLibrary.length === 0) {
    // Add sample books only if no books are stored
    addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 180, 'fiction', 'read', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1738790966i/4671.jpg');
    addBookToLibrary('1984', 'George Orwell', 328, 'sci-fi', 'unread', 'https://www.thebookdesigner.com/wp-content/uploads/2023/12/1984-book-cover-Penguin-Books-UK-cover-by-Shepard-Fairey-2008.jpg');
    addBookToLibrary('Pride and Prejudice', 'Jane Austen', 432, 'romance', 'reading', 'https://cdn1.bookmanager.com/i/m?b=Gg0juhEdEbbcDjZQ7fXpPQ&cb=1714604555');
    addBookToLibrary('The Lightning Thief(Percy Jackson and the Olympians, Book 1)', 'Rick Riordan', 416, 'fantasy', 'reading', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1400602609i/28187.jpg');
} else {
    displayBooks();
    updateStats();
}