$(function () {
  //カレンダーで日付登録
  $('#register_todo_due').datepicker();

  var trelloClient = new TrelloClient('Trello連携テスト');
  var $list_box = $('#register_todo_list_box');
  trelloClient.fetchLists().done(function (lists) {
    lists.forEach(function (list) {
      $list_box.append('<option id="' + list.id + '">' + list.name + '</option>');
    });
  });

  //新しいTrelloカードを追加
  $('#register_todo_submit').on('click', function () {
    trelloClient.postCard($('#register_todo_list_box>option:selected').attr('id'), $('#register_todo_title').val(), {
      desc: $('#register_todo_desc').val(),
      due: $('#register_todo_due').val()
    })
  });
});
