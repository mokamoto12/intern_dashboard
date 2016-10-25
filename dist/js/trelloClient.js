var TrelloClient = function (boardName) {
  var apiKey = '';  // f6d2702dfeed4e80fdec2a4ac93a062d
  var apiToken = '';  // 7cc812594ec89ef43289b0aa72690739919d18a9abcbf1d7f5dcb72ec9ca994a
  this.baseUrl = 'https://trello.com/1/';
  this.baseParam = {key: apiKey, token: apiToken};
  this.boardName = boardName;
  var self = this;
  this.fetchBoards().done(function (boards) {
    self.boardId = self.findBoard(boards).id;
  });
};



TrelloClient.prototype.fetchBoards = function () {
  return $.getJSON(this.baseUrl + 'members/me/boards', Object.assign({}, this.baseParam, {fields: 'name'}));
};

TrelloClient.prototype.findBoard = function (boards) {
  // boardのnameがthis.boardNameと同じものを見つける
  return boards.find(function (board) {

  });
};



TrelloClient.prototype.fetchLists = function () {
  return ;
};

TrelloClient.prototype.findList = function (lists, name) {
  // listのnameがnameと同じものを見つける
};



TrelloClient.prototype.postCard = function (listId, name, optionVal) {
  return $.post();
};

TrelloClient.prototype.postList = function (name) {
  return $.post();
};
