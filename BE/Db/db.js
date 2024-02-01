const mongoose = require("mongoose")

const databaseConnection =  mongoose.connect(process.env.MONGO_URL)

module.exports = {databaseConnection}