$(function () {
  //カレンダーで日付登録
  $('#one_push_due').datepicker();

  var apiKey = 'dca0005de0d4861551bde47e1246b4d0';
  var apiToken = 'ae910fa0a066cafd5e15c5a78fa8442416a2b1db191f11c787e8836a7ebbc6e8';
  var trelloUsername = 'me';
  var trelloClient = new TrelloClient(apiKey, apiToken, 'Trello連携テスト');
  trelloClient.fetchLists().done(function (lists) {
    lists.map(function (list) {
      $('#one_push_list_box').append('<option id="' + list.id + '">' + list.name + '</option>');
    });
  });

  //新しいTrelloカードを追加
  $('#one_push_submit').on('click', function () {
    trelloClient.postCard($('#one_push_list_box>option:selected').attr('id'), $('#one_push_title').val(), {
      desc: $('#one_push_desc').val(),
      due: $('#one_push_due').val()
    })
  });
});
