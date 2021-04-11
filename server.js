const express = require("express");
const app = express();
const connectDB = require('./config/db')
const Authentication = require("./routers/authentication")

app.use(express.json())
connectDB()
Authentication.config(app)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("server " + PORT))