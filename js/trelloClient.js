var TrelloClient = function (apiKey, apiToken, boardName) {
  var self = this;
  this.baseUrl = 'https://trello.com/1/';
  this.baseParam = {key: apiKey, token: apiToken};
  this.boardName = boardName;
  $.ajaxSetup({async: false});
  this.fetchBoards().done(function (json) {
    self.boardId = self.findBoard(json).id;
  });
  $.ajaxSetup({async: true});
};

TrelloClient.prototype.fetchBoards = function () {
  return $.getJSON(this.baseUrl + 'members/me/boards', Object.assign({}, this.baseParam, {fields: 'name'}))
};

TrelloClient.prototype.findBoard = function (json) {
  var self = this;
  return json.find(function (obj) {
    return obj.name === self.boardName;
  });
};

TrelloClient.prototype.fetchLists = function () {
  return $.getJSON(this.baseUrl + 'boards/' + this.boardId + '/lists', Object.assign({}, this.baseParam, {cards: 'open'}))
};

TrelloClient.prototype.postCard = function (listId, val, option) {
  return $.post(this.baseUrl + 'cards', Object.assign({}, this.baseParam, {idList: listId, name: val}, option));
};

TrelloClient.prototype.postList = function (name) {
  return $.post(this.baseUrl + 'boards/' + this.boardId + '/lists', Object.assign({}, this.baseParam, {name: name}));
};

TrelloClient.prototype.findList = function (lists, name) {
  var self = this;
  return lists.find(function (list) {
    return list.name === name;
  });
};
