// view for displaying collection of books

app = app || {};

app.LibraryView = Backbone.View.extend({
  el: '#books',

  initialize: function(initialBooks) {
    this.collection = new app.Library(initialBooks);
    this.render();

    this.listenTo(this.collection, 'add', this.renderBook);
  },

  // render library by rendering each book in it's collection
  render: function() {
    this.collection.each(function(item) {
      this.renderBook(item);
    }, this);
  },

  // render a book by creating a BookView and appending the element it renders to the library's element
  renderBook: function(item)  {
    var bookView = new app.BookView({
      model: item
    });

    this.$el.append(bookView.render().el);
  },

  events: {
    'click #add': 'addBook'
  },

  addBook: function(e) {
    e.preventDefault();

    var formData = {};

    $('#addBook div').children('input').each(function(i, el) {

      if ($(el).val() != '')
      {

        // for the cover image, replace the fake path with the real path 
        if (el.id == 'coverImage')
        {
          formData[el.id] = $(el).val().replace("C:\\fakepath\\", "img/");
        } 
        else
        {
          formData[el.id] = $(el).val();
        }
      }
    });

    this.collection.add(new app.Book(formData));
  }
});
