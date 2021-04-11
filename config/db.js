const config = require("config")
const mongoose = require("mongoose")
const db = config.get("mongoURI")

const connectDB = async()=>{
    try {
        await mongoose.connect(db, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB