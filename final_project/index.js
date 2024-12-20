const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.get("/users",(req,res)=>{
    res.send(JSON.stringify(users,null,2));
})

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if the user is logged in and has valid acces token 
    if(req.session.auth) {
        let token = req.session.auth['accessToken'];

        // verify JWT token
        jwt.verify(token, "access", (err,user) => {
            if(!err){
                req.user = user;
                next();
            }else{
                return res.status(403).json({ message: "User not authenticated"});
            }
        });
    }else{
        return res.status(403).json({ message: "Error logging in 2"});
        
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running in port " + PORT));
