$(function () {
  var mindMapBoardName = 'sandbox_mindmap';
  var mindMapTrelloClient = new TrelloClient(mindMapBoardName);
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
