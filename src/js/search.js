$(function () {
  var trelloClient = new TrelloClient('Trello連携テスト');
  var searchWidgetDom = new SearchWidgetDom('#search_word', '#search_result');
  var searchWidgetSorter = new SearchWidgetSorter('#search_result', 'search_sort_btn_active', 'search_result_list', 'search_result_card', 'search_label', 'search_due');
  var searchWidget = new SearchWidget(trelloClient, searchWidgetDom, searchWidgetSorter);
  searchWidget.addSearchFunction();
  searchWidgetSorter.addSortFunction('#search_sort_list', '#search_sort_label', '#search_sort_due');
});



var SearchWidgetSorter = function (resultSelector, activeBtnClass, resultListClass, resultCardClass, resultLabelClass, resultDueClass) {
  this.activeBtnClass= activeBtnClass;
  this.resultSlector = resultSelector;
  this.resultListClass = resultListClass;
  this.resultCardClass = resultCardClass;
  this.resultLabelClass = resultLabelClass;
  this.resultDueClass = resultDueClass;
};

SearchWidgetSorter.prototype.addSortFunction = function (list, label, due) {
  var self = this;
  $(list).on('click', function () {
    self.toggleActiveButton(list);
    self.sortByList();
  });

  $(label).on('click', function () {
    self.toggleActiveButton(label);
    self.sortByLabel();
  });

  $(due).on('click', function () {
    self.toggleActiveButton(due);
    self.sortByDue();
  });
};

SearchWidgetSorter.prototype.sortByList = function () {
  var lists = this.loadListsByDom();
  lists = lists.sort(function (list1, list2) {
    if (list1.dataset.listId > list2.dataset.listId) {
      return 1;
    }
    return -1;
  });
  this.displayLists(lists);
};

SearchWidgetSorter.prototype.sortByLabel = function () {
  var self = this;
  var lists = this.loadListsByDom();
  lists.each(function (i, list) {
    var sortedCard = self.getCardsByList(list).sort(function (card1, card2) {
      var card1Label = $('.' + self.resultLabelClass, card1).data('label-id');
      var card2Label = $('.' + self.resultLabelClass, card2).data('label-id');
      if (card1Label > card2Label) return 1;
      if (card1Label < card2Label) return -1;
      if (card1Label === undefined && card2Label !== undefined) return 1;
      if (card1Label !== undefined && card2Label === undefined) return -1;
    });
    $(list).remove('.' + self.resultCardClass);
    $(list).append(sortedCard)
  });
};

SearchWidgetSorter.prototype.getCardsByList = function (list) {
  return $('.' + this.resultCardClass, list);
};

SearchWidgetSorter.prototype.getDuesByList = function (list) {
  return $('.' + this.resultDueClass, list);
};

SearchWidgetSorter.prototype.sortByDue = function () {
  var self = this;
  var lists = this.loadListsByDom();
  lists.each(function (i, list) {
    var sortedCard = self.getCardsByList(list).sort(function (card1, card2) {
      var card1Due = $('.' + self.resultDueClass, card1).html();
      var card2Due = $('.' + self.resultDueClass, card2).html();
      if (card1Due > card2Due) return 1;
      if (card1Due < card2Due) return -1;
      if (card1Due === undefined && card2Due !== undefined) return 1;
      if (card1Due !== undefined && card2Due === undefined) return -1;
    });
    $(list).remove('.' + self.resultCardClass);
    $(list).append(sortedCard)
  });
};

SearchWidgetSorter.prototype.loadListsByDom = function () {
  return $('.' + this.resultListClass);
};

SearchWidgetSorter.prototype.toggleActiveButton = function (activeButtonSelector) {
  $('.' + this.activeBtnClass).removeClass(this.activeBtnClass);
  $(activeButtonSelector).addClass(this.activeBtnClass);
};

SearchWidgetSorter.prototype.displayLists = function (lists) {
  $(this.resultSlector).empty();
  $(this.resultSlector).append(lists);
};




var SearchWidget = function (client, dom, sort) {
  this.client = client;
  this.dom = dom;
  this.sort = sort;
};

SearchWidget.prototype.addSearchFunction = function () {
  var self = this;
  $('#search_submit').on('click', function () {
    self.sort.toggleActiveButton('#search_sort_list');
    self.dom.clearResult();
    self.client.fetchLists().done(function (lists) {
      var searchWord = self.dom.loadSearchWord();
      var hitCardsInLists = lists.map(function (list) {
        return self.searchCardInList(list, searchWord);
      }, this);
      self.dom.addResult(hitCardsInLists);
    });
  });
};

SearchWidget.prototype.searchCardInList = function (list, word) {
  var self = this;
  list.cards = list.cards.filter(function (card) {
    return self.isHitWord(card, word);
  });
  return list;
};

SearchWidget.prototype.isHitWord = function (card, word) {
  return card.name.match(word) || card.desc.match(word) || card.labels.some(function (label) {
      return label.name.match(word);
    });
};




var SearchWidgetDom = function (searchWordSelector, searchResultSelector) {
  this.searchWordSelector = searchWordSelector;
  this.$searchResultSelector = $(searchResultSelector);
};

SearchWidgetDom.prototype.clearResult = function () {
  this.$searchResultSelector.empty();
};
SearchWidgetDom.prototype.loadSearchWord = function () {
  return $(this.searchWordSelector).val();
};

SearchWidgetDom.prototype.addResult = function (lists) {
  lists.forEach(function (list) {
    this.$searchResultSelector.append(this.createListElm(list));
  }, this);
};

SearchWidgetDom.prototype.createCardElm = function (card) {
  var $link = $('<a class="search_result_card" href="' + card.shortUrl + '" target="_blank"></a>');
  var $card = $('<div><p class="search_result_card_title">' + card.name + '</p></div>');
  var $labels = card.labels.map(function (label) {
    return $('<span class="search_label" data-label-id="' + label.id + '" style="background-color:' + label.color + '">' + label.name + '</span>');
  });
  if (card.due !== null) {
    var time = card.due.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$1/$2/$3');
    var $due = $('<span class="search_due">' + time + '</span>');
  }
  // カードを組み立ててreturnする
};

SearchWidgetDom.prototype.createListElm = function (list) {
  var self = this;
  var $list = $('<div data-list-id="' + list.id + '" class="search_result_list"><h3 class="search_list_name">' + list.name + '</h3></div>');
  list.cards.forEach(function (card) {
    $list.append(self.createCardElm(card));
  });
  return $list;
};
