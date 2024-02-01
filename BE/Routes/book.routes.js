const express = require("express");
const { Book } = require("../Models/book.model");
const { User } = require("../Models/user.model");
const { isAllowed } = require("../middlewares/isAllowed");

const bookRouter = express.Router();
bookRouter.get("/myBooks", async (req, res)=>{
  console.log('sf')
  try {
      let {page, title, category, new:newone, old} = req.query
      let query = {};

      query.author = req.user.id
      if (category) query.category = category;

      if (title) query.title = new RegExp(title, "i");

      if(newone && newone==1) query = {...query, createdAt: {$gt : new Date(Date.now()) - 60*1000*10}}

      if(old && old==1) query = {...query, createdAt: {$lte : new Date(Date.now()) - 60*1000*10}}

      page  = page? +page : 1;
      console.log(query)
      const books = await Book.find(query)

      let perPage  = 10
      let startIndex = (page - 1) * perPage;
      let endIndex = startIndex + perPage;
      let totalBooks = books.length;
      let totalPages = Math.ceil(totalBooks/perPage)
      return res
      .status(200)
      .send({ 
          message: "here are the books", 
          isOk: true,
          books : books.splice(startIndex, endIndex), 
          totalBooks, 
          page,
          perPage,
          totalPages
      });
  } catch (error) {
      console.log(error)
      return res
      .status(400)
      .send({ message: "Inter Server Error!", isOk: false });
  }
})

bookRouter.get("/allBooks", async (req, res) => {
  let { category, page, title, new: newone , old } = req.query;
  try {
    let query = {};
    if (category) query.category = category;
    if (title) query.title = new RegExp(title, "i");
    if(newone && newone==1) query = {...query, createdAt: {$gt : new Date(Date.now()) - 60*1000*10}}
    if(old && old==1) query = {...query, createdAt: {$lte : new Date(Date.now()) - 60*1000*10}}
    

    let books = await Book.find(query).populate({path: "author", select : "name  email _id"})
      .sort({ createdAt : -1 })
    
    page  = page? +page : 1;
    let perPage  = 10
    let startIndex = (page - 1) * perPage;
    let endIndex = startIndex + perPage;
    let totalBooks = books.length;
    let totalPages = Math.ceil(totalBooks/perPage)
    return res
      .status(200)
      .send({ 
        message: "here are the books", 
        isOk: true,
        books : books.splice(startIndex, endIndex), 
        totalBooks, 
        page,
        perPage,
        totalPages
      });
  } catch (error) {
    console.log(error.message)
    return res
      .status(400)
      .send({ message: "Inter Server Error!", isOk: false });
  }
});

bookRouter.post("/addBook", isAllowed, async (req, res) => {
  try {
    const { title, category, content } = req.body;
    if (!title || !category || !content)
      return res
        .status(400)
        .send({
          message:
            "Please provide all the details for book i.e. title, content, category",
          isOk: false,
        });

    let user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).send({ message: "User not found!", isOk: false });

    const book = await Book.create({
      title,
      category,
      content,
      author: req.user.id,
          });
    if (!book)
      return res
        .status(400)
        .send({ message: "Error while publishing book", isOk: false });

    user.books.push(book._id);
    await user.save();

    return res
      .status(200)
      .send({ message: "Book published successfully", isOk: true, book });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Internal Server Error", isOk: false });
  }
});

bookRouter.get("/:bookId",async (req, res)=>{
    try {
        const {bookId} = req.params
        let book = await Book.findById(bookId).populate({
          path  : "author",
          select : "name email"
        })
        if(!book) return res.status(404).send({message : "Book not found!", isOk : false})
        return res.status(200).send({message : "Here is your book", book, isOk : true})
    } catch (error) {
        return res
        .status(400)
        .send({ message: "Inter Server Error!", isOk: false });
    }
})


bookRouter.put("/:bookId", isAllowed, async (req, res) => {
  const { title, content, category } = req.body;
  try {
    let { bookId } = req.params;
    if (!bookId)
      return res
        .status(400)
        .send({ message: "Please provide bookId", isOk: false });

    let book = await Book.findById(bookId);
    if (book.author != req.user.id)
      return res
        .status(400)
        .send({
          message: "You're not allowed to make changes in other's book",
          isOk: false,
        });

    book = await Book.findByIdAndUpdate(
      bookId,
      { title, content, category },
      { new: true }
    );

    return res
      .status(200)
      .send({ message: "Book Updated Successfully", isOk: true, book: book });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Inter Server Error!", isOk: false });
  }
});

bookRouter.delete("/:bookId", async (req, res) => {
    try {
      let { bookId } = req.params;
      if (!bookId)
        return res
          .status(400)
          .send({ message: "Please provide bookId", isOk: false });
  
      const book = await Book.findById(bookId);
      if (book.author != req.user.id)
        return res
          .status(400)
          .send({
            message: "You're not allowed to delete other's book",
            isOk: false,
          });
  
      await Book.findByIdAndDelete(bookId);
  
      await User.findByIdAndUpdate(book.author, { $pull: { books: bookId } });
  
      return res
        .status(200)
        .send({ message: "Book Deleted successfully", isOk: true, book: book });
    } catch (error) {
      return res
        .status(400)
        .send({ message: "Inter Server Error!", isOk: false });
    }
  });
  

module.exports = { bookRouter };
