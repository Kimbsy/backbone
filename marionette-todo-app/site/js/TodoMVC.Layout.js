TodoMVC.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  // layout header view
  Layout.Header = Backbone.Marionette.ItemView.extend({

    template: '#template-header',

    // ui bindings create cached attributes that point to jQuery selected objects
    ui: {
      input: '#new-todo'
    },

    events: {
      'keypress #new-todo': 'onInputKeypress',
      'blur #new-todo': 'onTodoBlur'
    },

    onTodoBlur: function() {
      var todoText = this.ui.input.val().trim();
      this.createTodo(todoText);
    },

    // if enter was pressed and there was text in the input, create a new item
    onInputKeypress: function(e) {
      var ENTER_KEY = 13;
      var todoText = this.ui.input.val().trim();

      if (e.which === ENTER_KEY && todoText) {
        this.createTodo(todoText);
      }
    },

    // clear the input
    completeAdd: function() {
      this.ui.input.val('');
    },

    // create a new todo item with the given title
    createTodo: function(todoText) {
      if (todoText.trim() === '') {return;}

      var model = new App.Todos.todo({title: todoText});

      this.collection.add(model);

      this.completeAdd();
    }
  });

  // layout footer view
  Layout.Footer = Marionette.Layout.extend({

    template: '#template-footer',

    ui: {
      todoCount: '#todo-count .count',
      todoCountLabel: '#todo-count .label',
      clearCount: '#clear-completed .count',
      filters: '#filters a'
    },

    events: {
      'click #clear-completed': 'onClearClick'
    },

    initialize: function() {
      this.bindTo(App.vent, 'todoList:filter', this.updateFilterSelection, this);
      this.bindTo(this.collection, 'all', this.updateCount, this);
    },

    onRender: function() {
      this.updateCount();
    },

    updateCount: function() {
      var activeCount = this.collection.getActive().length;
      var completedCount = this.collection.getCompleted().length;

      this.ui.todoCount.html(activeCount);
      this.ui.todoCountLabel.html(activeCount === 1 ? 'item' : 'items');
      this.ui.clearCount.html(completedCount === 0 ? '' : '(' + completedCount + ')');
    },

    // remove the 'selected' class from all the filetrs, then add it to the one specified
    updateFilterSelection: function(filter) {
      this.ui.filters
        .removeClass('selected')
        .filter('[href="#' + filter + '"]')
        .addClass('selected');
    },

    onClearClick: function() {
      var  completed = this.collection.getCompleted();

      for (var i = 0; i < completed.length; i++) {
        completed[i].destroy();
      }
    }
  });

});
