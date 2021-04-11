const express = require("express");
const app = express();
const connectDB = require('./config/db')
const Auth = require("./models/Auth")
const authentication = require("./routers/authentication")

authentication.configure(app)
connectDB()
// const newAccount = new Auth({username: "qn", password: "12312", refreshToken: null})
// newAccount.save();

// app.get("/getText", (req,res)=>{
//     res.json({text: "123"})
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log("server " + PORT))