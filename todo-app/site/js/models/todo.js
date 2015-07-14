var app = app || {};

// basic Todo model
app.Todo = Backbone.Model.extend({

  // default attributes
  defaults: {
    title: '',
    completed: false
  },

  // funxction for toggling completed sttatus
  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }

});
