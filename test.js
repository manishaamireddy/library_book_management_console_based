const { Book, listBooks, borrowBook, returnBook, library, borrowedBooks , listOfBorrowedBooks, searchBook} = require('./index'); // Ensure correct path

jest.useFakeTimers();

describe('Library Management System Tests', () => {
    beforeEach(() => {
        library.splice(0, library.length,
            new Book("Book_1", "Author_1", 3),
            new Book("Book_2", "Author_2", 5),
            new Book("Book_3", "Author_3", 2)
        );
        Object.keys(borrowedBooks).forEach(key => delete borrowedBooks[key]);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers(); 
        jest.clearAllTimers(); 
    });

    test('listBooks should print all available books in the library', () => {
        console.log = jest.fn();
        listBooks();
        expect(console.log).toHaveBeenCalledWith("Here is the list of all available books:");
        expect(console.log).toHaveBeenCalledWith("1. Title: Book_1, Author: Author_1, Quantity: 3");
        expect(console.log).toHaveBeenCalledWith("2. Title: Book_2, Author: Author_2, Quantity: 5");
        expect(console.log).toHaveBeenCalledWith("3. Title: Book_3, Author: Author_3, Quantity: 2");
        expect(console.log).toHaveBeenCalledWith("\n");
    });

    test('borrowBook should allwo user to borrow book if available decrease the quantity of a book when borrowed', () => {
        borrowBook('user1', 'Book_1');
        jest.runAllTimers();
        expect(library.find(book => book.title === 'Book_1').quantity).toBe(2);
        expect(borrowedBooks['user1']['Book_1']).toBe(1);
    });
    
      test('borrowBook does not allow a book to be borrowed if unavailable', () => {
        borrowBook('user2', 'Book_1');
        borrowBook('user2', 'Book_1');
        borrowBook('user2', 'Book_1'); //no copies available now
        borrowBook('user2', 'Book_1');
        expect(console.log).toHaveBeenCalledWith("Book is not available.\n");
        jest.runAllTimers();
      });    

    test('returnBook should allow user to return book only if he borrowed thus increase the quantity of a book when returned', () => {
        borrowBook('user1', 'Book_1'); 
        returnBook('user1', 'Book_1'); 
        jest.runAllTimers(); 
        expect(library.find(book => book.title === 'Book_1').quantity).toBe(3);
        expect(borrowedBooks['user1']['Book_1']).toBeUndefined();
    });

    test('should print no borrowed books for a user with no books', () => {
        const userId = 'user1';
        console.log = jest.fn(); 
        listOfBorrowedBooks(userId);
        expect(console.log).toHaveBeenCalledWith(`Borrowed books by User ${userId}:\n`);
        expect(console.log).toHaveBeenCalledWith("No books borrowed at this moment by User user1\n");
    });

    test('should print all books borrowed by a specific user', () => {
        const userId = 'user2';
        borrowedBooks[userId] = { 'Book_1': 1, 'Book_2': 2 }; 
        console.log = jest.fn(); 
        listOfBorrowedBooks(userId);
        expect(console.log).toHaveBeenCalledWith(`Borrowed books by User ${userId}:\n`);
        expect(console.log).toHaveBeenCalledWith("Title: Book_1, Quantity borrowed: 1\n");
        expect(console.log).toHaveBeenCalledWith("Title: Book_2, Quantity borrowed: 2\n");
    });

    test('should print all borrowed books across all users when no userId is provided', () => {
        borrowedBooks['user3'] = { 'Book_1': 1 };
        borrowedBooks['user4'] = { 'Book_1': 2, 'Book_3': 1 }; 
        console.log = jest.fn(); 
        listOfBorrowedBooks();
        expect(console.log).toHaveBeenCalledWith("Listing all borrowed books across all users:");
        expect(console.log).toHaveBeenCalledWith("Title: Book_1, Total Quantity borrowed: 3\n");
        expect(console.log).toHaveBeenCalledWith("Title: Book_3, Total Quantity borrowed: 1\n");
    });

    test('listOfBorrowedBooks displays the correct message for a user without borrowed books', () => {
        console.log = jest.fn(); 
        listOfBorrowedBooks('user1');
        expect(console.log).toHaveBeenCalledWith("No books borrowed at this moment by User user1\n");
      });
    
    
    test('should print the correct search results when books are found', () => {
        console.log = jest.fn(); 
        searchBook('Book_1', 'user1');
        expect(console.log).toHaveBeenCalledWith("Search results:");
        expect(console.log).toHaveBeenCalledWith("1. Title: Book_1, Author: Author_1, Quantity: 3");
      });
    
      test('should print a correct message when no books are found', () => {
        console.log = jest.fn(); 
        searchBook('Nonexistent Book', 'user1');
        expect(console.log).toHaveBeenCalledWith("No books found matching the search criteria.\n");
      });
    

});