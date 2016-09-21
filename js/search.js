$(function () {
  var apiKey = '6934d38ef199df9d14099dbc119a7ea5';
  var apiToken = '28495b56169afac766d6ad94abf619d441c867b588d63a3a17111782b325d87b';
  var trelloClient = new TrelloClient(apiKey, apiToken, 'Trello連携テスト');
  var searchWidgetDom = new SearchWidgetDom('#search_word', '#search_result');
  var searchWidget = new SearchWidget(trelloClient, searchWidgetDom);
  searchWidget.addSearchFunction();
});


var SearchWidget = function (client, dom) {
  this.client = client;
  this.dom = dom;
};

SearchWidget.prototype.addSearchFunction = function () {
  var self = this;
  $('#search_submit').on('click', function () {
    self.dom.clearResult();
    self.client.fetchLists().done(function (lists) {
      lists.map(function (list) {
        $('#search_result').append(self.dom.createListElm(list));
      });
    });
  });
};

var SearchWidgetDom = function (searchWordSelector, searchResultSelector) {
  this.searchWordSelector = searchWordSelector;
  this.searchResultSelector = searchResultSelector;
};

SearchWidgetDom.prototype.clearResult = function () {
  $(this.searchResultSelector).empty();
};
SearchWidgetDom.prototype.loadSearchWord = function () {
  return $(this.searchWordSelector).val();
};

SearchWidgetDom.prototype.createCardElm = function (card) {
  var $link = $('<a class="search_result_card" href="' + card.shortUrl + '" target="_blank"></a>');
  var $card = $('<div><p>' + card.name + '</p></div>');
  card.labels.forEach(function (label) {
    $card.append($('<span class="search_label" style="background-color:' + label.color + '">' + label.name + '</span>'));
  });
  if (card.due !== null) {
    var time = card.due.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$1/$2/$3');
    $card.append($('<span class="search_due">' + time + '</span>'));
  }
  return $link.append($card);
};

SearchWidgetDom.prototype.createListElm = function (list) {
  var self = this;
  var $list = $('<div class="search_result_list"><h3 class="search_list_name">' + list.name + '</h3></div>');
  var regexp = new RegExp(this.loadSearchWord());
  list.cards.forEach(function (card) {
    if (self.checkWordMatchInCard(card, regexp)) {
      $list.append(self.createCardElm(card));
    }
  });
  return $list;
};

SearchWidgetDom.prototype.checkWordMatchInCard = function (card, regexp) {
  return card.name.match(regexp) || card.desc.match(regexp) || card.labels.some(function (label) {
      return label.name.match(regexp);
    });
};
