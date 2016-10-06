(function ($) {
  'use strict';
  $(function () {
    var trelloClient = new TrelloClient('sandbox_mindmap');
    var mindMapDom = new MindMapDom('body');
    var mindMap = new MindMap(mindMapDom, trelloClient);
    mindMap.show();
    mindMap.addAddNodeFunction('node_text', 'add_node');
  });



  var MindMap = function (mindMapDom, trelloClient) {
    this.dom = mindMapDom;
    this.client = trelloClient;
  };

  MindMap.prototype.show = function () {
    var self = this;
    this.dom.clearMindMap();
    this.client.fetchLists().done(function (lists) {
      var mindMapData = self.buildMindMapData(lists, 'マインドマップ');
      self.dom.displayMindMap(mindMapData);
    });
  };

  MindMap.prototype.buildMindMapData = function (allLists, parentNode) {
    var retObj = {name: parentNode};                        // retObjにノードの名前をセットする
    retObj.child = allLists.find(function (listObj) {
      return listObj.name === parentNode;                   // リスト一覧からノードのリストを取得し
    }, this).cards.map(function (cardObj) {                 // その子ノード(list.cards)それぞれに対して
      return this.buildMindMapData(allLists, cardObj.name); // buildMindMapDataを実行したものの配列をretObj.childに入れる
    }, this);
    return retObj;
  };

  MindMap.prototype.addAddNodeFunction = function (textId, buttonId) {
    this.dom.addAddNodeElement(textId, buttonId);
    this.addAddNodeEvent(textId, buttonId);
  };

  MindMap.prototype.addAddNodeEvent = function (textId, buttonId) {
    var self = this;
    $('#' + buttonId).on('click', function () {
      self.client.fetchLists().done(function (lists) {
        var activeNodeName = self.dom.getActiveNodeName();
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





  var MindMapDom = function (selector) {
    this.selector = selector;
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
}(jQuery));
