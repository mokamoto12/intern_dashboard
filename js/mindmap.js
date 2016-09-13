(function ($) {
  'use strict';
  $(function () {
    var api_key = '6934d38ef199df9d14099dbc119a7ea5',
      api_token = '23c94140fbbb78afa14b02259b2934c07d71b0b102fc0de68a09c5aaaf0c4ff8',
      board_id = '',
      test_name = 'sandbox_mindmap';


    /**
     * ajaxのURL生成
     */
    function createUrl(mode, boardId) {
      var url = '';
      switch (mode) {
        case 'getBoardId':
          url = 'https://trello.com/1/members/me/boards?key=' + api_key + '&token=' + api_token + '&fields=name';
          break;
      }
      return url;
    }

    /**
     * GETのajax
     */
    function getAjax(mode, boardId) {
      var result = $.ajax({
        type: 'GET',
        dataType: 'json',
        url: createUrl(mode, boardId)
      });
      return result;
    }

    /**
     * ボードのidを取得する
     */
    function getBoardId() {
      getAjax('getBoardId').done(function (data) {
        $.each(data, function () {
          if (this.name === test_name) {
            board_id = this.id;
            return false;
          }
        });
        return board_id;
      }).fail(function () {
        alert('getBoardId:失敗');
      });
    }

  });
}(jQuery));
