(function ($) {
  'use strict';
  $(function () {
    var apiKey = '6934d38ef199df9d14099dbc119a7ea5';
    var apiToken = '28495b56169afac766d6ad94abf619d441c867b588d63a3a17111782b325d87b';
    var trelloClient = new TrelloClient(apiKey, apiToken, 'sandbox_mindmap');
    var mindMapDom = new MindMapDom('body');
    var mindMap = new MindMap(mindMapDom, trelloClient);
    mindMap.displayMindMap();
    mindMap.addAddNodeFunction('node_text', 'add_node');
  });

  var MindMap = function (mindMapDom, trelloClient) {
    this.mindMapDom = mindMapDom;
    this.client = trelloClient;
  };

  MindMap.prototype.displayMindMap = function () {
    var self = this;
    self.mindMapDom.clearMindMap();
    self.client.fetchLists().done(function (lists) {
      var mindMapData = self.buildMindMapData(lists, 'マインドマップ');
      self.mindMapDom.displayMindMap(mindMapData);
    });
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

  MindMap.prototype.addAddNodeFunction = function (textId, buttonId) {
    this.mindMapDom.addAddNodeElement(textId, buttonId);
    this.addAddNodeEvent(textId, buttonId);
  };

  MindMap.prototype.addAddNodeEvent = function (textId, buttonId) {
    var self = this;
    $('#' + buttonId).on('click', function () {
      self.client.fetchLists().done(function (lists) {
        var activeNodeName = self.mindMapDom.getActiveNodeName();
        var listId = self.client.findList(lists, activeNodeName).id;
        var nodeName = $('#' + textId).val();
        console.log(nodeName)
        self.client.postList(nodeName).done(function () {
          self.client.postCard(listId, nodeName).done(function () {
            self.displayMindMap();
          });
        });
      });
    });
  };



  var TrelloClient = function (apiKey, apiToken, boardName) {
    var self = this;
    this.baseUrl = 'https://trello.com/1/';
    this.baseParam = {key:apiKey, token:apiToken};
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

  TrelloClient.prototype.postCard = function (listId, val) {
    return $.post(this.baseUrl + 'cards', Object.assign({}, this.baseParam, {idList: listId, name: val}));
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

  MindMapDom.prototype.clearMindMap = function () {
    $(this.selector + '>ul').remove();
    $(this.selector + '>a').remove();
    $(this.selector + '>svg').remove();
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

  MindMapDom.prototype.addAddNodeElement = function (textId, buttonId) {
    this.addElement($('<input id="' + textId + '" type="text">'));
    this.addElement($('<button id="' + buttonId + '">ノードを追加</button>'));
  };

  MindMapDom.prototype.addElement = function (elm) {
    $(this.selector).append(elm);
  };

  MindMapDom.prototype.getActiveNodeName = function () {
    return $('.active').html();
  };
}(jQuery));
