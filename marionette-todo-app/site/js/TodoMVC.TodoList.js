TodoMVC.module('TodoList', function(TodoList, App, Backbone, Marionette, $, _) {

  // TodoList router (handles routes to show active/completed  list items)
  TodoList.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '*filter': 'filterItems'
    }
  });

  // TodoList controller (control the workflow and logic that exists at the application level)
  TodoList.Controller = function() {
    this.todoList = new App.Todos.TodoList();
  };

  _.extend(TodoList.Controller.prototype, {

    // start the app by showing the appropriate views and fetching any todos
    start: function() {
      this.showHeader(this.todoList);
      this.showFooter(this.todoList);
      this.showTodoList(this.todoList);

      App.bindTo(this.todoList, 'reset add remove', this.toggleFooter, this);
      this.todoList.fetch();
    },

    showHeader: function(todoList) {
      var header = new App.Layout.Header({
        collection: todoList
      });
      App.header.show(header);
    },

    showFooter: function(todoList) {
      var footer = new App.Layout.Footer({
        collection: todoList
      });
      App.footer.show(footer);
    },

    showTodoList: function(todoList) {
      console.log(todoList);
      App.main.show(new TodoList.Views.ListView({
        collection: todoList
      }));
    },

    toggleFooter: function() {
      App.footer.$el.toggle(this.todoList.length);
    },

    // set the filter to show specified items
    filterItems: function(filter) {
      App.vent.trigger('todoList:filter', filter.trim() || '');
    }
  });

  // TodoList initializer
  TodoList.addInitializer(function() {

    var controller = new TodoList.Controller();
    new TodoList.Router({
      controller: controller
    });

    controller.start();

  });

});
