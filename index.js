// Imports
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

// create the app
const app = express()

// import our Mongoose model
const TodoTask = require('./models/TodoTask')

// Configure .env file
dotenv.config()

// Use the public folder for static resources
app.use('/static', express.static('public'))

// UrlEncoded extracts data from forms and adds it to the URL
app.use(express.urlencoded({ extended: true }))

// Connect to the database using the URL stored in the DB_CONNECT env variable (in .env)
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log('Connected to db!')
  // Host the app on port 3000
  app.listen(3000, () => console.log('Server Up and running'))
})

// Set the view engine to EJS (Embedded Javascript Templates)
app.set('view engine', 'ejs')

// Handle Get methods from '/' by rendering the 'todo.ejs' file with todo's we get from the database using find()
app.get('/', (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render('todo.ejs', { todoTasks: tasks })
  })
})

// Handle Post methods by creating a new todo and saving it to the database using save()
app.post('/', async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  })
  // try and wait for the save operation to complete
  // otherwise redirect to the home page if failure
  try {
    await todoTask.save()
    res.redirect('/')
  } catch (err) {
    res.redirect('/')
  }
})

// Handle updates by finding the todo by its ID and updating it in the database (while also rendering a new version of the frontend with the edit)
// This is captured by the /edit route (when the browser is pointed to this path, the following function is triggered)
// The editting code points the browser to [url]/edit/[todo id] to activate this code
app
  .route('/edit/:id')
  // first re-render the page
  .get((req, res) => {
    const id = req.params.id
    TodoTask.find({}, (err, tasks) => {
      res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id })
    })
  })
  // now update the todo in the database
  .post((req, res) => {
    const id = req.params.id
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
      if (err) return res.send(500, err)
      res.redirect('/')
    })
  })

// Handle deletes by finding the todo by its ID, removing it from the database, and redirecting back to the main page
// This is captured by the /remove route (when the browser is pointed to this path, the following function is triggered)
// The removal code points the browser to [url]/remove/[todo id] to activate this code
app.route('/remove/:id').get((req, res) => {
  const id = req.params.id
  TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err)
    res.redirect('/')
  })
})
