const express = require('express');
let books = require("./booksdb.js");
const { JsonWebTokenError } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if(username && password){
        //Check if user is valid
        if(!isValid(username)){
            // Add the new user tho users array 
            users.push({"username": username,"password": password});
            return res.status(201).json({ massage: "User successfuy registred. Now you can Login"});
        }else{
            return res.status(404).json({ message: "User already exixts!"});
        }
    }else{
        return res.status(404).json({ message: "You need provide a username an password"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    res.status(201).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book = Object.values(books).filter(book => book.author === author);

    if(book.length === 0){
        return res.status(404).send({message: "No books found fot this author. "});
    }
    res.send(JSON.stringify(book));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bKey = null;
    for(let key in books){
        if(books.hasOwnProperty(key)){
            let book = books[key];
            if(book.title === title){
                    bKey = key;
            }
        }
    }
      res.send(JSON.stringify(books[bKey]));
});


//  Get book review
public_users.get('/reviews/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filteredBook = books[isbn].reviews;
    res.send(JSON.stringify(filteredBook));

});

module.exports.general = public_users;
