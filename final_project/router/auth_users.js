const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ 
    let userWithSamseName = users.filter((user) => {
        return user.username === username;
    });
    if(userWithSamseName.length > 0){
        return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validUsers = users.filter((user) => {
        return(user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if(validUsers.length > 0) {
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(400).json({ message: "Error logging in 1 "});
    }

    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data:password
        }, 'access', {expiresIn: '1h'});

        req.session.auth = {
            accessToken: accessToken, 
            username: username
        };
        return res.status(200).send("User successfuly logged in");
    }else{
        return res.status(208).json({ message: "Inavlid Login, check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(!req.session.auth || !req.session.auth.username){
        return res.send("You haven´t access, pleas log in first");
    }
    let book = books[req.params.isbn];
    let review = req.body.review
    book.reviews = {
        "username": req.session.auth.username,
        "review": review
        };
    res.status(202).send(`The review: "${review}" has been added in  ${book.title} by user ${req.session.auth.username}!`);

});
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    
if(!req.session.auth || !req.session.auth.username){
    
    return res.status(401).send("You don´t have access, please log in first");
}
    let book = books[req.params.isbn];
    let review = book.reviews;

    if(review['username'] === req.session.auth.username){
        delete review['username'];
        delete review['review'];
        return res.send(`The review by ${req.session.auth.username} has been deleted`);
    }else{
        res.send("You haven´t reviews about this book");
    }

});

regd_users.get("/auth/reviews/:isbn",(req,res)=>{
    let book = books[req.params.isbn];
    res.send(book.reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
