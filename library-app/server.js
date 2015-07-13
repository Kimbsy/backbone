// module dependancies
var application_root = __dirname,
    express = require('express'), // web framework
    bodyParser = require('body-parser'), // parser for reading request body
    path = require('path'), // utilities for dealing with file paths
    mongoose = require('mongoose'); // mongodb integration

// create server
var app = express();

// where to serve static content
app.use(express.static(path.join(application_root, 'site')));
app.use(bodyParser());

// start server
var port = 4711;

app.listen(port, function() {
  console.log('Express server is listening on port %d in %s mode', port, app.settings.env);
});

// routes
app.get('/api', function(request, response) {
  response.send('Library API is running');
});

// connect to database
mongoose.connect('mongodb://localhost/library_database');

// schemas
var Keywords = new mongoose.Schema({
  keyword: String
});

var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date,
  keywords: [Keywords]
});

// models
var BookModel = mongoose.model('Book', Book);

// configure server
app.configure(function() {
  // parses request body and populates request.body
  app.use(express.bodyParser());

  // checks request.body for HTTP method overrides
  app.use(express.methodOverride());

  // perform route lookup based on url and HTTP method
  app.use(app.router);

  // where to serve static content
  app.use(express.static(path.join(application_root, 'site')));

  // show all errors in development
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

/**
 * API
 * 
 * url             HTTP Method  Operation
 * /api/books      GET          Get an array of all books
 * /api/books/:id  GET          Get the book with id of :id
 * /api/books      POST         Add a new book and return the book with an id attribute added
 * /api/books/:id  PUT          Update the book with id of :id
 * /api/books/:id  DELETE       Delete the book with id of :id
 */

// get a list of all books
app.get('/api/books', function(request, response) {
  return BookModel.find(function(err, books) {
    if (!err) {
      return response.send(books);
    }
    else {
      return console.log(err);
    }
  });
});

// insert a new book
app.post('/api/books', function(request, response) {
  var book = new BookModel({
    title: request.body.title,
    author: request.body.author,
    releaseDate: request.body.releaseDate,
    keywords: request.body.keywords
  });

  return book.save(function(err) {
    if (!err) {
      console.log('created');
      return response.send(book);
    }
    else {
      console.log(err);
    }
  });
});

// get a single book by id
app.get('/api/books/:id', function(request, response) {
  return BookModel.findById(request.params.id, function(err, book) {
    if (!err) {
      return response.send(book);
    }
    else {
      return console.log(err);
    }
  });
});

// update a book
app.put('/api/books/:id', function(request, response) {
  console.log('updating book ' + request.body.title);

  return BookModel.findById(request.params.id, function(err, book) {
    book.title = request.body.title;
    book.author = request.body.author;
    book.releaseDate = request.body.releaseDate;
    book.keywords = request.body.keywords;

    return book.save(function(err) {
      if (!err) {
        console.log('book updated');
        return response.send(book);
      }
      else {
        console.log(err);
      }
    });
  });
});

// delete a book
app.delete('/api/books/:id', function(request, response) {
  console.log('deleting book with id ' + request.params.id);

  return BookModel.findById(request.params.id, function(err, book) {
    return book.remove(function(err) {
      if (!err) {
        console.log('book removed');
        return response.send('');
      }
      else {
        console.log(err);
      }
    });
  });
});
