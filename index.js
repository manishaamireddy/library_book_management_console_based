const readline = require('readline');
const fs = require('fs');
const path = require('path');
const library_file = path.join(__dirname, 'library.json');
const borrowedBooks_file = path.join(__dirname, 'borrowedBooks.json');


let library = JSON.parse(fs.readFileSync(library_file, 'utf8'));
let borrowedBooks = JSON.parse(fs.readFileSync(borrowedBooks_file, 'utf8'));
let userId
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

const saveToLibrary = () => {
    fs.writeFileSync(library_file, JSON.stringify(library, null, 2), 'utf8');
};

const saveToBorrowed = () => {
    fs.writeFileSync(borrowedBooks_file, JSON.stringify(borrowedBooks, null, 2), 'utf8');
};

function listBooks() {
    console.log("Here is the list of all available books:");
    library = JSON.parse(fs.readFileSync(library_file, 'utf8'));
    library.forEach((book, index) => {
        console.log(`${index + 1}. Title: ${book.title}, Author: ${book.author}, Quantity: ${book.quantity}`);
    });
}

function borrowBook(userId,title)
{
    library = JSON.parse(fs.readFileSync(library_file, 'utf8'));
    borrowedBooks = JSON.parse(fs.readFileSync(borrowedBooks_file, 'utf8'));
    const book = library.find(book => book.title.toLowerCase() === title.toLowerCase());
    console.log(book)
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
        console.log(`User ${userId} has borrowed "${title}".`);
        saveToLibrary();
        saveToBorrowed();
    } else {
        console.log("Book is not available.");
    }
    setTimeout(() => mainMenu(userId), 500);  
}

function returnBook(userId, title)
{
    // check if the book is borrowed which the user want to return
    borrowedBooks = JSON.parse(fs.readFileSync(borrowedBooks_file, 'utf8'));
    if (borrowedBooks[userId] && borrowedBooks[userId][title] > 0) {
        const book = library.find(book => book.title.toLowerCase() === title.toLowerCase());
        if (book) {
            book.quantity++;
            borrowedBooks[userId][title]--;
            if (borrowedBooks[userId][title] === 0) {
                delete borrowedBooks[userId][title];
            }
            console.log(`User ${userId} has returned "${title}".`);
            saveToLibrary();
            saveToBorrowed();
        }
    } else {
        console.log(`User ${userId} hasn't borrowed this book.`);
    }
    setTimeout(() => mainMenu(userId), 500);  // Maintain the same session
}

function listOfBorrowedBooks(userId=null) {
    borrowedBooks = JSON.parse(fs.readFileSync(borrowedBooks_file, 'utf8'));
    if (userId) {
        // Display books for a specific user
        const userBooks = borrowedBooks[userId] || {};
        console.log(`Borrowed books by User ${userId}:`);
        if (Object.keys(userBooks).length === 0) {
            console.log("No books borrowed at this moment by User " + userId);
        } else {
            Object.keys(userBooks).forEach(book => {
                if (userBooks[book] > 0) {
                    console.log(`  Title: ${book}, Quantity borrowed: ${userBooks[book]}`);
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
            console.log("No books are currently borrowed.");
        } else {
            Object.keys(aggregateBooks).forEach(book => {
                console.log(`Title: ${book}, Total Quantity borrowed: ${aggregateBooks[book]}`);
            });
        }
    }
}


function listOfBorrowedBooksCall(userId) {
    rl.question(`1. Do you want to see all borrowed books or 2. only borrowed books of the user ${userId}\n`, function(choice){
        switch(choice) {
            case '1':
                listOfBorrowedBooks();
                break;
            case '2':
                listOfBorrowedBooks(userId)
                break;
            default:
                console.log("Invalid option. Please select 1 or 2.");
                listOfBorrowedBooksCall(userId); 
        }
        setTimeout(() => mainMenu(userId), 500); 
    })
}




function mainMenu(userId) {
    rl.question("Choose an option: 1: List books 2: Borrow a book 3: Return a book 4: Show borrowed books 5: Exit\n", function(choice) {
        switch(choice) {
            case '1':
                listBooks();
                break;
            case '2':
                rl.question("Enter the title of the book you want to borrow: ", title => borrowBook(userId, title));
                break;
            case '3':
                rl.question("Enter the title of the book you want to return: ", title => returnBook(userId, title));
                break;
            case '4':
                listOfBorrowedBooksCall(userId);
                break;
            case '5':
                rl.close();
                return;
            default:
                console.log("Invalid option. Please choose any number from the menu again.");
        }
        setTimeout(() => mainMenu(userId), 500);  
    });
}

rl.question("Enter your user ID: ", userId => {
    userId= userId
    mainMenu(userId)
})