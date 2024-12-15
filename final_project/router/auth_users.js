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
        return res.status(404).json({ message: "Erro logging in"});
    }

    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data:password
        }, 'access', {expiresIn: 120 * 60});

        res.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfuly logged");
    }else{
        return res.send("Inavlid Login, check username and password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
