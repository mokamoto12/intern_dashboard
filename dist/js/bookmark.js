$(function () {
  var trelloClient = new TrelloClient('Trello連携テスト');
  var store = new BookmarkStore(trelloClient, 'ブックマーク');
  var bookmarkWidget = new BookmarkWidget(store, 'ブックマーク', '#bookmark_submit', '#bookmark_target', '#bookmark_list');
  bookmarkWidget.init();
  bookmarkWidget.addBookmarkFunction();
});

var BookmarkWidget = function (store, bookmarkListName, submitSelector, targetSelector, listSelector) {
  this.store = store;
  this.listName = bookmarkListName;
  this.submitSelector = submitSelector;
  this.targetSelector = targetSelector;
  this.listSelector = listSelector;
  this.bookmarkTarget = '';
};

BookmarkWidget.prototype.init = function () {
  var self = this;
  this.store.fetchAllBookmarks().done(function (bookmarks) {
    // bookmarksそれぞれについてHTML要素を作成し追加する
  });
};

BookmarkWidget.prototype.createBookmarkElement = function (url, title, image) {
  return $('<a href="' + url + '" target="_blank" class="bookmark_link"><img class="bookmark_favicon" src="' + image + '">' + title + '</a>');
};

BookmarkWidget.prototype.appendBookmarkElm = function (elm) {
  $(this.listSelector).append(elm);
};



BookmarkWidget.prototype.addBookmarkFunction = function () {
  var self = this;
  $(this.submitSelector).on('click', function () {
    self.bookmarkTarget = self.loadBookmarkTarget();
    self.clickEvent();
  });
};

BookmarkWidget.prototype.loadBookmarkTarget = function () {
  return $(this.targetSelector).val();
};

BookmarkWidget.prototype.clickEvent = function () {
  var self = this;
  self.fetchTargetInfo().done(function (info) {
    self.store.addBookmark(info.url, info.title, self.createFaviconSrc());
    self.appendBookmarkElm(self.createBookmarkElement(info.url, info.title, self.createFaviconSrc()));
  });
};

BookmarkWidget.prototype.fetchTargetInfo = function () {
  return $.getJSON('http://api.hitonobetsu.com/ogp/analysis?callback=?&url=' + this.bookmarkTarget)
};

BookmarkWidget.prototype.createFaviconSrc = function () {
  return 'https://www.google.com/s2/favicons?domain=' + this.bookmarkTarget;
};




var BookmarkStore = function (client, listName) {
  this.client = client;
  this.listId = null;
  this.listName = listName;
};

BookmarkStore.prototype.addBookmark = function (url, title, imageSrc) {
  var self = this;
  if (self.listId === null) {
    this.client.fetchLists().done(function (lists) {
      self.listId = self.client.findList(lists, self.listName).id;
      self.client.postCard(self.listId, title, {desc: JSON.stringify({url: url, image: imageSrc})});
    });
    return;
  }
  self.client.postCard(self.listId, title, {desc: JSON.stringify({url: url, image: imageSrc})});
};

BookmarkStore.prototype.fetchAllBookmarks = function () {
  var self = this;
  var items = [];
  var d = $.Deferred();
  this.client.fetchLists().done(function (lists) {
    items = ; // Trelloからリスト一覧を取得しその中からブックマークリストを見つける
              // ブックマークリストのcardsそれぞれをブックマークのデータに加工する
              // データの形式は {title: card.name, url: card.desc.url, image: card.desc.image};
    d.resolve(items);
  });
  return d.promise();
};
