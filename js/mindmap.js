(function ($) {
  'use strict';
  $(function () {
    var api_key = '6934d38ef199df9d14099dbc119a7ea5',
      api_token = '23c94140fbbb78afa14b02259b2934c07d71b0b102fc0de68a09c5aaaf0c4ff8',
      test_name = 'sandbox_mindmap',
      $MindMap = $('#MindMap');


    /**
     * ajaxのURL生成
     */
    function createUrl(mode, id) {
      var url = '';
      switch (mode) {
        case 'getBoardId':
          url = 'https://trello.com/1/members/me/boards?key=' + api_key + '&token=' + api_token + '&fields=name';
          break;
        case 'getList':
          url = 'https://trello.com/1/boards/' + id + '/lists?key=' + api_key + '&token=' + api_token + '&fields=name';     // id : ボードid
          break;
        case 'getCardList':
          url = 'https://trello.com/1/lists/' + id + '/cards?key=' + api_key + '&token=' + api_token + '&fields=name';      // id : リストid
          break;
        case 'getAllCardList':
          url = 'https://trello.com/1/boards/' + id + '/cards?key=' + api_key + '&token=' + api_token + '&fields=name,idList';      // id : ボードid
          break;
      }
      return url;
    }

    /**
     * GETのajax
     */
    function getAjax(mode, id) {
      var result = $.ajax({
        type: 'GET',
        dataType: 'json',
        url: createUrl(mode, id)
      });
      return result;
    }

    /**
     * ボードのidを取得し、idを返す
     */
    var getBoardId = function (name) {
      var board_id = '',
        defer = $.Deferred();
      getAjax('getBoardId').done(function (data) {
        $.each(data, function () {
          if (this.name === name) {
            board_id = this.id;
            return false; // break
          }
        });
        defer.resolve(board_id);
      }).fail(function () {
        alert('getBoardId:失敗');
      });
      return defer.promise(this);
    };

    /**
     * リスト一覧を取得し、オブジェクト配列で返す
     */
    var getList = function (boardId) {
      var list = [],
        defer = $.Deferred();
      getAjax('getList', boardId).done(function (data) {
        $.each(data, function () {
          var objList = {};
          objList['id'] = this.id;
          objList['name'] = this.name;
          list.push(objList);
        });
        defer.resolve(list);
      }).fail(function () {
        alert('getList:失敗');
      });
      return defer.promise(this);
    };

    /**
     * 指定のリスト内のカードを取得し、オブジェクト配列で返す
     */
    var getCardList = function (listId) {
      var list = [],
        defer = $.Deferred();
      getAjax('getCardList', listId).done(function (data) {
        $.each(data, function () {
          var objList = {};
          objList['id'] = this.id;
          objList['name'] = this.name;
          list.push(objList);
        });
        defer.resolve(list);
      }).fail(function () {
        alert('getCardList:失敗');
      });
      return defer.promise(this);
    };

    /**
     * ボード内のカードを取得し、オブジェクト配列で返す
     */
    var getAllCardList = function (boardId) {
      var list = [],
        defer = $.Deferred();
      getAjax('getAllCardList', boardId).done(function (data) {
        $.each(data, function () {
          var objList = {};
          objList['id'] = this.id;
          objList['name'] = this.name;
          objList['listId'] = this.idList;
          list.push(objList);
        });
        defer.resolve(list);
      }).fail(function () {
        alert('getAllCardList:失敗');
      });
      return defer.promise(this);
    };

    /**
     * 取得した配列を整理しなおす
     */
    function sortCardList(cardList, Lists, listName) {
      var listId = searchListsName(listName, Lists),
        selectList = searchListsCard(cardList, listId);
      return selectList;
    }

    /**
     * 指定のカード名と一致するリストIDを出力する
     */
    function searchListsName(cardName, Lists) {
      var ListsId = '';
      $.each(Lists, function () {
        if (this.name === cardName) {
          ListsId = this.id;
          return false; // break
        }
      });
      return ListsId;
    }

    /**
     * 指定のリストIDを持つカードを配列で出す
     */
    function searchListsCard(cardList, listId) {
      var list = [];
      $.each(cardList, function () {
        if (this.idList === listId) {
          var objList = {};
          objList['id'] = this.id;
          objList['name'] = this.name;
          objList['child'] = '';
          list.push(objList);
        }
      });
      return list;

    }

    /**
     * カード名をhtml側に出力する
     */
    function addLiElements(cardName) {
      var element = '<li><a href="#">' + cardName + '</a></li>';
      $MindMap.append(element);
    }

    /**
     * ボードidを読み取り後のメイン処理
     */
    function mainProcess(boardId) {
      $.when(
        getList(boardId),
        getAllCardList(boardId)
      ).done(function (getList, cardList) {
      });
    }

    /**
     * メイン処理
     */
    $.when(
      getBoardId(test_name)
    ).done(function (boardId) {
      mainProcess(boardId);
    });
  });
}(jQuery));
