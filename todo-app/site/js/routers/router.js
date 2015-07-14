var app = app || {};

var Workspace = Backbone.Router.extend({

  routes: {
    '*filter': 'setFilter'
  },

  // set the current filter to be used
  setFilter: function(param) {
    if (param) {
      param = param.trim();
    }

    app.TodoFilter = param || '';

    // trigger a collection filter event causing hiding/unhiding of Todo view items
    app.Todos.trigger('filter');
  }

});

app.TodoRouter = new Workspace();
Backbone.history.start();
