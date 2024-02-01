const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');
const { authRouter } = require('./Routes/auth');
const { databaseConnection } = require('./Db/db');
const { bookRouter } = require('./Routes/book.routes');
const {isAuthenticated} = require("./middlewares/auth")
const cors=require("cors")
const app = express();
app.use(cors())
app.use(bodyParser.json());

// Configure winston logger
const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: 'api-method-endpoints.log', format: winston.format.simple() })
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }); 
  
app.get("/", (req, res) =>{
    return res.json({message : 'Wel-come to the BookStore!'})
})
    
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));

app.use('/auth', authRouter)

app.use("/book",isAuthenticated, bookRouter)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await databaseConnection
        console.log('connected to db')
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on port ${PORT}`);
});
