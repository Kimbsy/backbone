var app = app || {};

// collection of Todo models
var TodoList = Backbone.Collection.extend({

  // reference to this collection's model
  model: app.Todo,

  // save all the todos under the 'todos-backbone' namespace
  localStorage: new Backbone.LocalStorage('todos-backbone'),

  // filter down list to todos that are finished
  completed: function() {
    return this.filter(function(todo) {
      return todo.get('completed');
    });
  },

  // filter down list to todos that are not finished
  remaining: function() {
    return this.without.apply(this, this.completed());
  },

  // We keep the Todos in sequential order, despite being saved by unordered GUID in the database.
  // This generates the next order number for new items.
  nextOrder: function() {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // todos are sorted by their original insertion order
  comparator: function(todo) {
    return todo.get('order');
  }

});

// create global list of Todos
app.Todos = new TodoList();
