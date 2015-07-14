var TodoMCV = new Backbone.Marionette.Application();

TodoMCV.addRegions({
  header: '#header',
  main: '#main',
  footer: '#footer'
});

TodoMCV.on('start', function() {
  Backbone.history.start();
});
