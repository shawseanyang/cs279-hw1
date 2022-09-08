// Defines a Mongoose model of a Todo item to store in the database
// Gives todos a structure in the otherwise unstructured format of MongoDB

const mongoose = require('mongoose')
const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('TodoTask', todoTaskSchema)
