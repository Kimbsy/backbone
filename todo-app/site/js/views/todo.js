var app = app || {};

// the DOM element for a todo item
app.TodoView = Backbone.View.extend({

  // use a li tag
  tagName: 'li',

  template: _.template($('#item-template').html()),

  // the DOM events specific to an item
  events: {
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // nthe TodoView listens for changes to its model re-rendering. Since there's
  // a one-to-one correspondence between a Todo and a TodoView int this app, we
  // set a direct reference on the model for convenience.
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // re-renders titles of todo item
  render: function() {
    this.$el.html(this.template(this.model.attributes));

    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  // toggle visibility of item
  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden());
  },

  // determines if item should be hidden
  isHidden: function() {
    var isCompleted = this.model.get('completed');

    return (
      (!isCompleted && app.TodoFilter === 'completed') || 
      (isCompleted && app.TodoFilter === 'active')
    );
  },

  // toggle the 'completed' state of the model
  toggleCompleted: function() {
    this.model.toggle();
  },

  // switch this view into editing mode, displaying input field
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // close the editing mode saving changes to the todo
  close: function() {
    var value = this.$input.val().trim();

    if (value) {
      this.model.save({title: value});
    }

    this.$el.removeClass('editing');
  },

  // if you hit enter we're done editing the line
  updateOnEnter: function(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },

  // remove the item, destroy the model from localStorage and delete it's view
  clear: function() {
    this.model.destroy();
  }

});

