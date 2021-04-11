const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Auth =  new Schema({
    username :{
        type: String,
        required: true,
    },
    password :{
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    }
})

module.exports = mongoose.model('auth', Auth)