var app = app || {};

// overall AppView is the top level piece of UI
app.AppView = Backbone.View.extend({

  // instead of generating a new element, bind to the existing skeleton in the HTML
  el: '#todoapp',

  // our template for showing statistics at the bottom of the app
  statsTemplate: _.template($('#stats-template').html()),

  // delegated events for creating new items and clearing completed ones
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // at initialization, we bind all the relevant events on the 'Todos' collection
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);

    app.Todos.fetch();
  },

  // re-rendering the app just means changing the statistics, the rest of the app doesn't change
  render: function() {
     var completed = app.Todos.completed().length;
     var remaining = app.Todos.remaining().length;

     if (app.Todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
        .addClass('selected');
     } else {
      this.$main.hide();
      this.$footer.hide();
     }

     this.allCheckbox.checked = !remaining;
  },

  // add a single todo item by creating a view for it and appending it's element to the ul
  addOne: function(todo) {
    var view = new app.TodoView({model: todo});
    $('#todo-list').append(view.render().el);
  },

  // add all items in the Todos colleciton at once
  addAll: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  },

  filterOne: function(todo) {
    todo.trigger('visible');
  },

  filterAll: function() {
    app.Todos.each(this.filterOne, this);
  },

  // generate attributes for a new Todo item
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  // if you hit enter in the main input field, create a new Todo model and save it to loacl storage
  createOnEnter: function(event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    app.Todos.create(this.newAttributes());
    this.$input.val('');
  },

  // clear all completed todo items, destroying their models
  clearCompleted: function() {
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Todos.each(function(todo) {
      todo.save({
        'completed': completed
      });
    });
  }

});
