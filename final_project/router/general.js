const express = require('express');
let books = require("./booksdb.js");
const { JsonWebTokenError } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


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
public_users.get('/', async function (req, res) {
    try{
        const booksData = await new Promise((resolve,reject)=>{
            setTimeout(()=>{
            resolve(books);
        }, 10000);
    });
    res.status(200).json(booksData);
    }catch(error){
        res.status(500).send('Error to obtain the data: ' + error.massage);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const bookRequiere = books[req.params.isbn];

    new Promise((resolve,reject)=> {
        try{
            resolve(bookRequiere);
        }catch(error) {
            res.status(500).send("Erro to obtain data: " + error.message);
        }
    })
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch((error)=>{
        res.status(500).send(error.massage);
    });
            
   
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try{
    const author = req.params.author;
    const book = await new Promise((resolve,reject)=> {
        const foundbook = Object.values(books).filter(book => book.author === author);
        resolve(foundbook);
    });
    
    if(book.length === 0){
        return res.status(404).send({message: "No books found fot this author. "});
    }
    res.send(JSON.stringify(book));
    }catch(error){
        res.status(500).send("Erro occurs to process the request: " + error.message);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    new Promise((resolve,reject)=>{
        let bKey = null;
        for(let key in books){
            if(books.hasOwnProperty(key)){
                let book = books[key];
                if(book.title === title){
                        bKey = key;
                        break;
                }
            }
        }
        if(bKey){
            resolve(books[bKey]);
        }else{
            reject("No book found with given title");
        }
    })
    .then((book) => {
    res.status(200).json(book)
    })
    .catch((error)=> {
        res.status(404).send({message: error});
    });
});


//  Get book review
public_users.get('/reviews/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filteredBook = books[isbn].reviews;
    res.send(JSON.stringify(filteredBook));
});

module.exports.general = public_users;
