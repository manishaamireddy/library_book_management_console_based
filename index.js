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

let library = [
    new Book("Book_1", "Auther_1", 3),
    new Book("Book_2", "Author_2", 5),
    new Book("Book_3", "AUthor_3", 2)
];

let borrowedBooks={}

function listBooks() {
    console.log("Here is the list of all available books:");
    library.forEach((book, index) => {
        console.log(`${index + 1}. Title: ${book.title}, Author: ${book.author}, Quantity: ${book.quantity}`);
    });
}

function listOfBorrowedBooks() {
    let checkIfBooksBorrowed = (Object.values(borrowedBooks).filter((quantity)=>quantity>0)).length
    if(checkIfBooksBorrowed==0)
        console.log("No books borrowed at this moment")
    else
    {
        console.log("Here is the list of all borrowed books:");
        Object.keys(borrowedBooks).forEach(book => {
            if (borrowedBooks[book] > 0) {
                console.log(`Title: ${book}, Quantity borrowed: ${borrowedBooks[book]}`);
            }
        });
    }
}

function borrowBook(title)
{
    // check if the book is available
    const book = library.find(book => book.title.toLowerCase() === title.toLowerCase());
    // if book is available (quantity>0)
    if (book && book.quantity > 0) {
        book.quantity--;
        borrowedBooks[title] = (borrowedBooks[title] || 0) + 1;
        console.log(`You have borrowed "${title}".`);
    } else {
        console.log("Book is not available.");
    }
    setTimeout(mainMenu, 1000); 
}

function returnBook(title)
{
    // check if the book is borrowed which the user want to return
    if (borrowedBooks[title] > 0) {
        const book = library.find(book => book.title.toLowerCase() === title.toLowerCase());
        if (book) {
            book.quantity++;
            borrowedBooks[title]--;
            console.log(`You have returned "${title}".`);
        }
    } else {
        console.log("You haven't borrowed this book.");
    }
    setTimeout(mainMenu, 1000); 
}


function mainMenu() {
    rl.question("Choose an option: 1: List books 2: Borrow a book 3: Return a book 4: Show borrowed books 5: Exit\n", function(choice) {
        switch(choice) {
            case '1':
                listBooks();
                break;
            case '2':
                rl.question("Enter the title of the book you want to borrow: ", borrowBook);
                break;
            case '3':
                rl.question("Enter the title of the book you want to return: ", returnBook);
                break;
            case '4':
                listOfBorrowedBooks()
                break;
            case '5':
                rl.close();
                return;
            default:
                console.log("Invalid option. Please choose any number from the menu again.");
        }
        setTimeout(mainMenu, 1000); 
    });
}

mainMenu()