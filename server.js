const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config()

// Connect to mongoDB
mongoose.connect('mongodb+srv://holly:' + process.env.DB_PASSWORD + '@cluster0.qx2hs.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

//static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
  res.render('index');
});

// Parse url-encoded and json bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle CORS
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods',
          'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
  }
  next(); 
})

// include routes
const expenseRoutes = require('./api/routes/expense')
// expense routes
app.use('/expense', expenseRoutes)
app.use(morgan('dev'));

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status(404);
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.sendFile("public/404.html", { root: __dirname })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})