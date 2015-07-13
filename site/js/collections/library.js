// collection is an array of books

var app = app || {};

app.Library = Backbone.Collection.extend({
  model: app.Book
});
