$(function () {
  var trelloClient = new TrelloClient('Trello連携テスト');
  var achieveRate = new AchieveRate(trelloClient, '#achieve_rate');
  achieveRate.show('done');
});



var AchieveRate = function (trelloClient, selector) {
  this.client = trelloClient;
  this.selector = selector;
};

AchieveRate.prototype.show = function (calcListName) {
  var self = this;
  this.client.fetchLists().done(function (lists) {
    // listsから達成率を計算し表示する
  });
};

AchieveRate.prototype.calcRate = function (calcListName, lists) {
  var self = this;
  var achieveCardCnt = ; // calcListNameのリストを探しそれのcardsの数を数える
  var allCardCnt = ; // listsそれぞれのcardsの数を合計する
  return achieveCardCnt / allCardCnt;
};

AchieveRate.prototype.displayRate = function (rate) {
  // ウィジェットに達成率を表示する
};
