var AchieveRateWidget = function (trelloClient, selector) {
  this.client = trelloClient;
  this.selector = selector;
};

AchieveRateWidget.prototype.calcRate = function (doneList, lists) {
  var self = this;
  var achieveCardCnt = self.client.findList(lists, doneList).cards.length;
  var allCardCnt = lists.reduce(function (prev, list) {
    return prev + list.cards.length;
  }, 0);
  return (Math.round(10000 * (achieveCardCnt / allCardCnt))) / 100;
};

AchieveRateWidget.prototype.displayRate = function (rate) {
  $(this.selector).append('<span class="achieve_rate_rate">' + rate + '%</span>');
};
