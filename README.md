# library_book_management_console_based

This is a console based Library Book Management System designed to efficiently manage a local library's inventory. Users can interact through a simple console interface, allowing them to perform various tasks such as viewing available books, borrowing, returning, searching for books, and checking their borrowed books.Several users can access the system within a single session.

### How to run
1. Clone `git clone <repository_url>`
2. Project directory: `cd library_book_management_console_based`
3. Install dependencies: `npm install`
4. Run `node index.js`
5. Follow the prompts to interact with the system.

### Testing
1. Ensure you are in the project directory.
2. Run unit tests: `npm test`


### Functionalities

Upon entering the user ID, the menu will be displayed, allowing the user to make selections.
1. View Available Books: Users can see a list of all available books in the library
2. Borrow a Book: User can borrow a book from the library if copies of the book are available at that moment
3. Return a Book: User can return a book to the library only if he borrowed it.
4. Search for a Book: Users can search for a book by title or author name to check its availability and quantity in the library.
5. Display Borrowed Books: Users can see a list of books they have currently borrowed.
6. Log out the current user to allow another user to access the library management system.
7. Exit the system

Unless the user chooses to exit the system after completing certain actions, the menu will reappear, allowing them to perform further actions or enabling a new user to use the system.






