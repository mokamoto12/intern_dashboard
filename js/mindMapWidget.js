$(function () {
  var apiKey = '6934d38ef199df9d14099dbc119a7ea5';
  var apiToken = '28495b56169afac766d6ad94abf619d441c867b588d63a3a17111782b325d87b';
  var mindMapBoardName = 'sandbox_mindmap';
  var mindMapTrelloClient = new TrelloClient(apiKey, apiToken, mindMapBoardName);
  var mindMapWidget = new MindMapWidget(mindMapTrelloClient, 'マインドマップ');
  mindMapWidget.init();
});

var MindMapWidget = function (trelloClient, rootName) {
  this.client = trelloClient;
  this.rootName = rootName;
};

MindMapWidget.prototype.init = function () {
  var self = this;
  self.client.fetchLists().done(function (lists) {
    self.client.findList(lists, self.rootName).cards.map(function (list) {
      $('#mind_map').append('<p><a href="mindmap.html" class="mind_map__node">' + list.name + '</a></p>');
    });
  });
};
