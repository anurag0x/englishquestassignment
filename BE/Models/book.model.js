const mongoose = require("mongoose")

const bookSchema = new  mongoose.Schema({
    title : {type : String, required : true},
    author : {type : mongoose.Schema.Types.ObjectId, ref : "user", required : true},
    category : {type: String, required : true},
    content : {type : String, required  : true}
}, { timestamps: true })


const Book =new mongoose.model('book', bookSchema)

module.exports = {Book}