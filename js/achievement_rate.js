$(function () {
  var trelloClient = new TrelloClient('6934d38ef199df9d14099dbc119a7ea5', '28495b56169afac766d6ad94abf619d441c867b588d63a3a17111782b325d87b', 'Trello連携テスト');
  var achieveRateWidget = new AchieveRateWidget(trelloClient, '#achieve_rate', 'done');
  achieveRateWidget.calcRate().done(function (rate) {
    achieveRateWidget.displayRate(rate);
  });
});



var AchieveRateWidget = function (trelloClient, selector, doneList) {
  this.client = trelloClient;
  this.selector = selector;
  this.doneList = doneList;
};

AchieveRateWidget.prototype.calcRate = function () {
  var self = this;
  var d = $.Deferred();
  this.client.fetchLists().done(function (lists) {
    var achieveCardCnt = self.client.findList(lists, self.doneList).cards.length;
    var allCardCnt = lists.reduce(function (prev, list) {
      return prev + list.cards.length;
    }, 0);
    d.resolve((Math.round(10000 * (achieveCardCnt / allCardCnt))) / 100);
  });
  return d.promise();
};

AchieveRateWidget.prototype.displayRate = function (rate) {
  $(this.selector).append('<span class="achieve_rate_rate">' + rate + '%</span>')
};
