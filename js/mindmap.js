(function ($) {
  'use strict';
  $(function () {
    var apiKey = '6934d38ef199df9d14099dbc119a7ea5';
    var apiToken = '28495b56169afac766d6ad94abf619d441c867b588d63a3a17111782b325d87b';
    var trelloClient = new TrelloClient(apiKey, apiToken, 'sandbox_mindmap');
    var mindMapDom = new MindMapDom('body');
    var mindMap = new MindMap(mindMapDom);
    trelloClient.fetchBoards().done(function (json) {
      trelloClient.fetchLists(trelloClient.findBoard(json).id).done(function (lists) {
        var mindMapData = mindMap.buildMindMapData(lists, 'マインドマップ');
        mindMap.displayMindMap(mindMapData);
      });
    });
  });

  var MindMap = function (mindMapDom) {
    this.mindMapDom = mindMapDom;
  };

  MindMap.prototype.buildMindMapData = function (lists, name) {
    var retObj = {name: name};
    retObj.child = lists.find(function (listObj) {
      return listObj.name === name;
    }, this).cards.map(function (cardObj) {
      return this.buildMindMapData(lists, cardObj.name);
    }, this);
    return retObj;
  };

  MindMap.prototype.displayMindMap = function (data) {
    this.mindMapDom.displayMindMap(data);
  };



  var TrelloClient = function (apiKey, apiToken, boardName) {
    var self = this;
    this.baseUrl = 'https://trello.com/1/';
    this.baseParam = {key:apiKey, token:apiToken};
    this.boardName = boardName;
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

  TrelloClient.prototype.fetchLists = function (boardId) {
    return $.getJSON(this.baseUrl + 'boards/' + boardId + '/lists', Object.assign({}, this.baseParam, {cards: 'open'}))
  };




  var MindMapDom = function (selector) {
    this.selector = selector;
  };

  MindMapDom.prototype.displayMindMap = function (data) {
    var self = this;
    self.addMindMapElement(data);
    $(self.selector).mindmap({
      showSublines: true,
      canvasError: "alert",
      mapArea: {x:-1, y:-1}
    });

    // add the data to the mindmap
    var root = $(self.selector + '>ul>li').get(0).mynode = $(self.selector).addRootNode($(self.selector + '>ul>li>a').text(), {
      href:'/',
      url:'/',
      onclick:function(node) {
        $(node.obj.activeNode.content).each(function() {
          this.hide();
        });
      }
    });
    $(self.selector + '>ul>li').hide();
    var addLI = function() {
      var parentnode = $(this).parents('li').get(0);
      if (typeof(parentnode)=='undefined') parentnode=root;
      else parentnode=parentnode.mynode;

      this.mynode = $(self.selector).addNode(parentnode, $('a:eq(0)',this).text(), {
//          href:$('a:eq(0)',this).text().toLowerCase(),
        href:$('a:eq(0)',this).attr('href'),
        onclick:function(node) {
          $(node.obj.activeNode.content).each(function() {
            this.hide();
          });
          $(node.content).each(function() {
            this.show();
          });
        }
      });
      $(this).hide();
      $('>ul>li', this).each(addLI);
    };
    $(self.selector + '>ul>li>ul').each(function() {
      $('>li', this).each(addLI);
    });
  };

  MindMapDom.prototype.addMindMapElement = function (data) {
    $(this.selector).append(this.createElement(data));
  };

  MindMapDom.prototype.createElement = function (data) {
    var $li = $('<li>').append('<a href="#">' + data.name + '</a>');
    var appendElm = data.child.map(function (d) {
      return this.createElement(d);
    }, this);
    $li.append(appendElm);
    return $('<ul>').append($li);
  };
}(jQuery));
