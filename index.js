const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Book {
    constructor(title, author, quantity) {
        this.title = title;
        this.author = author;
        this.quantity = quantity;
    }
}

// initializing books in library
let library = [
    new Book("Book_1", "Author_1", 3),
    new Book("Book_2", "Author_2", 5),
    new Book("Book_3", "Author_3", 2)
];

let borrowedBooks = {}

// View the list of available books
function listBooks() {
    console.log("Here is the list of all available books:");
    library.forEach((book, index) => {
        console.log(`${index + 1}. Title: ${book.title}, Author: ${book.author}, Quantity: ${book.quantity}`);
    });
    console.log("\n")
}

// Borrow a book
function borrowBook(userId, title) {
    const book = library.find(book => book.title.toLowerCase() === title.toLowerCase());
    // if book is available (quantity>0)
    if (book && book.quantity > 0) {
        book.quantity--;
        if (!borrowedBooks[userId]) {
            borrowedBooks[userId] = {};
        }
        // Initialize the book count if it doesn't exist
        if (!borrowedBooks[userId][title]) {
            borrowedBooks[userId][title] = 0;
        }
        borrowedBooks[userId][title]++;
        console.log(`User ${userId} has borrowed "${title}".\n`);
    } else {
        console.log("Book is not available.\n");
    }
    setTimeout(() => mainMenu(userId), 1000);
}

// Return a book
function returnBook(userId, title) {
    // check if the book is borrowed which the user want to return
    if (borrowedBooks[userId] && borrowedBooks[userId][title] > 0) {
        const book = library.find(book => book.title.toLowerCase() === title.toLowerCase());
        if (book) {
            book.quantity++;
            borrowedBooks[userId][title]--;
            if (borrowedBooks[userId][title] === 0) {
                delete borrowedBooks[userId][title];
            }
            console.log(`User ${userId} has returned "${title}".\n`);
        }
    } else {
        if (library.find(book => book.title.toLowerCase() === title.toLowerCase()))
            console.log(`User ${userId} hasn't borrowed this book.\n`);
        else
            console.log(`This book doesn't exist in the library\n`)
    }
    setTimeout(() => mainMenu(userId), 1000); 
}

// Display borrowed books
function listOfBorrowedBooks(userId = null) {
    if (userId) {
        // Display books for a specific user
        const userBooks = borrowedBooks[userId] || {};
        console.log(`Borrowed books by User ${userId}:\n`);
        if (Object.keys(userBooks).length === 0) {
            console.log("No books borrowed at this moment by User " + userId + "\n");
        } else {
            Object.keys(userBooks).forEach(book => {
                if (userBooks[book] > 0) {
                    console.log(`Title: ${book}, Quantity borrowed: ${userBooks[book]}\n`);
                }
            });
        }
    } else {
        // Display all borrowed books across all users
        console.log("Listing all borrowed books across all users:");
        let aggregateBooks = {};

        for (const user in borrowedBooks) {
            Object.keys(borrowedBooks[user]).forEach(book => {
                if (borrowedBooks[user][book] > 0) {
                    if (!aggregateBooks[book]) {
                        aggregateBooks[book] = 0;
                    }
                    aggregateBooks[book] += borrowedBooks[user][book];
                }
            });
        }

        if (Object.keys(aggregateBooks).length === 0) {
            console.log("No books are currently borrowed.\n");
        } else {
            Object.keys(aggregateBooks).forEach(book => {
                console.log(`Title: ${book}, Total Quantity borrowed: ${aggregateBooks[book]}\n`);
            });
        }
    }
}

// search books
function searchBook(query, userId) {
    const searchResults = library.filter(book => {
        // Check if the query matches the book's title or author 
        return (
            book.title.toLowerCase() === (query.toLowerCase()) ||
            book.author.toLowerCase() === (query.toLowerCase())
        );
    });

    if (searchResults.length === 0) {
        console.log("No books found matching the search criteria.\n");
    } else {
        console.log("Search results:");
        searchResults.forEach((book, index) => {
            console.log(`${index + 1}. Title: ${book.title}, Author: ${book.author}, Quantity: ${book.quantity}`);
        });
    }
    setTimeout(() => mainMenu(userId), 1000);

}



function mainMenu(userId) {
    rl.question("Choose an option from 1-6 \n1: List books \n2: Borrow a book \n3: Return a book \n4: Show borrowed books \n5: Search for a book by author or title \n6: Log out of the system \n7: Exit\n", function (choice) {
        switch (choice) {
            case '1':
                listBooks();
                break;
            case '2':
                listBooks()
                rl.question("Enter the title of the book you want to borrow: ", title => borrowBook(userId, title));
                break;
            case '3':
                rl.question("Enter the title of the book you want to return: ", title => returnBook(userId, title));
                break;
            case '4':
                listOfBorrowedBooks(userId);
                break;
            case '5':
                rl.question("Enter the title or author name of the book you want to search for : ", query => searchBook(query, userId));
                break;
            case '6':
                console.log(`User ${userId} logged out`)
                rl.question("Enter your user ID: ", userId => {
                    mainMenu(userId)
                })
                return;
            case '7':
                rl.close();
                return;
            default:
                console.log("Invalid option. Please choose any number from the menu again.");
        }
        setTimeout(() => mainMenu(userId), 1000);
    });
}

rl.question("Enter your user ID: ", userId => {
    userId = userId
    mainMenu(userId)
})

module.exports = {
    listBooks,
    searchBook,
    returnBook,
    borrowBook,
    listOfBorrowedBooks,
    library,
    borrowedBooks,
    Book
}