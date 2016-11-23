var TrelloClient = function (boardName) {
  var self = this;
  var apiKey = 'f6d2702dfeed4e80fdec2a4ac93a062d';
  var apiToken = '7cc812594ec89ef43289b0aa72690739919d18a9abcbf1d7f5dcb72ec9ca994a';
  this.baseUrl = 'https://trello.com/1/';
  this.baseParam = {key: apiKey, token: apiToken};
  this.boardName = boardName;
  var boardIdCacheKey = '__cache_boardId_' + boardName + '_' + apiToken;
  $.ajaxSetup({async: false});
  if (localStorage.getItem(boardIdCacheKey) === null) {
    self.fetchBoards().done(function (json) {
      self.boardId = self.findBoard(json).id;
      localStorage.setItem(boardIdCacheKey, self.boardId);
    });
  } else {
    self.boardId = localStorage.getItem(boardIdCacheKey);
  }
  $.ajaxSetup({async: true});
};

TrelloClient.prototype.fetchBoards = function () {
  return $.getJSON(this.baseUrl + 'members/me/boards', Object.assign({}, this.baseParam, {fields: 'name'}))
};

TrelloClient.prototype.findBoard = function (json) {
  return json.find(function (obj) {
    return obj.name === this.boardName;
  }, this);
};

TrelloClient.prototype.fetchLists = function () {
  return $.getJSON(this.baseUrl + 'boards/' + this.boardId + '/lists', Object.assign({}, this.baseParam, {cards: 'open'}))
};

TrelloClient.prototype.postCard = function (listId, val, optionVal) {
  return $.post(this.baseUrl + 'cards', Object.assign({}, this.baseParam, {idList: listId, name: val}, optionVal));
};

TrelloClient.prototype.postList = function (name) {
  return $.post(this.baseUrl + 'boards/' + this.boardId + '/lists', Object.assign({}, this.baseParam, {name: name}));
};

TrelloClient.prototype.findList = function (lists, name) {
  return lists.find(function (list) {
    return list.name === name;
  });
};
