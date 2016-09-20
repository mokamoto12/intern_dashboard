$(function () {
  var apiKey = '6934d38ef199df9d14099dbc119a7ea5';
  var apiToken = '28495b56169afac766d6ad94abf619d441c867b588d63a3a17111782b325d87b';
  var trelloClient = new TrelloClient(apiKey, apiToken, 'Trello連携テスト');
  var searchWidget = new SearchWidget(trelloClient);
  searchWidget.addSearchFunction();
});


var SearchWidget = function (client) {
  this.client = client;
};

SearchWidget.prototype.addSearchFunction = function () {
  var self = this;
  $('#search_submit').on('click', function () {
    self.client.fetchLists().done(function (lists) {
      lists.map(function (list) {
        $list = $('<div class="search_result_list"><h3 class="search_list_name">' + list.name + '</h3></div>');
        list.cards.forEach(function (card) {console.log(card)
          $p = $('<div class="search_result_card"><p>' + card.name + '</p></div>');
          card.labels.forEach(function (label) {
            $p.append($('<span class="search_label" style="background-color:' + label.color + '">' + label.name + '</span>'));
          });
          if (card.due !== null) {
            var time = card.due.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$1/$2/$3');
            $p.append($('<span class="search_due">' + time + '</span>'));
          }
          $list.append($p);
        });
        $('#search_result').append($list);
      });
    });
  })
};
