// view for displaying collection of books

app = app || {};

app.LibraryView = Backbone.View.extend({
  el: '#books',

  initialize: function() {
    this.collection = new app.Library();
    this.collection.fetch({reset: true});
    this.render();

    this.listenTo(this.collection, 'add', this.renderBook);
    this.listenTo(this.collection, 'reset', this.render);
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

      if ($(el).val() != '') {

        // for keywords, split them up
        if (el.id === 'keywords') {
          formData[el.id] = [];
          _.each($(el).val().split(' '), function(keyword) {
            formData[el.id].push({'keyword': keyword});
          });
        }
        // for release date convert it into the correct format
        else if (el.id === 'releaseDate') {
          formData[el.id] = $('#releaseDate').datepicker('getDate').getTime();
        }
        // for the cover image, replace the fake path with the real path 
        else if (el.id === 'coverImage') {
          formData[el.id] = $(el).val().replace("C:\\fakepath\\", "img/");
        } 
        else {
          formData[el.id] = $(el).val();
        }
      }
    });

    this.collection.create(formData);
  }
});
