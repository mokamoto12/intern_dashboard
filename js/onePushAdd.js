$(function () {
  //カレンダーで日付登録
  $("#datepicker").datepicker();
  $("#datepicker").datepicker("option", "showOn", 'button');
  $("#datepicker").datepicker("option", "buttonImageOnly", true);
  $("#datepicker").datepicker("option", "buttonImage", 'ico_calendar.png');

  var trelloApiKey = "dca0005de0d4861551bde47e1246b4d0";
  var trelloApiToken = "ae910fa0a066cafd5e15c5a78fa8442416a2b1db191f11c787e8836a7ebbc6e8";
  var trelloUsername = "user09300969";

  //ボード名を取得。
  $.ajax({

    type: "GET",
    dataType: "jsonp",
    url: "https://trello.com/1/members/" + trelloUsername + "/boards?key=" + trelloApiKey + "&token=" + trelloApiToken + "&fields=name",

  }).done(function (data) {

    alert(data[0].name);
    var arrBoard = {};
    for (var i = 0; i < data.length; i++) {
      arrBoard[data[i].id] = data[i].name;
      $('#board_box').append('<option id="' + data[i].id + '">' + data[i].name + '</option>');
    }

    //ボード名が選ばれたらリスト名を取得
    $('#board_box').on('change',

        function () {
          alert('change');
          $('#list_box').empty();
          $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "https://trello.com/1/boards/" + $('#board_box option:selected').attr('id') + "/lists?key=" + trelloApiKey + "&token=" + trelloApiToken + "&fields=name",
          }).done(function (data) {
            var arrList = {};
            for (var i = 0; i < data.length; i++) {
              arrList[data[i].id] = data[i].name;
              $('#list_box').append('<option id="' + data[i].id + '">' + data[i].name + '</option>');
            }

          }).fail(function () {
            alert('list error');
          });

        });
  }).fail(function () {

    alert('board error');

  });

  //新しいTrelloカードを追加
  $('#add_btn').on('click', function () {
    var trelloApiKey = "dca0005de0d4861551bde47e1246b4d0";
    var trelloApiToken = "ae910fa0a066cafd5e15c5a78fa8442416a2b1db191f11c787e8836a7ebbc6e8";
    var title = $('#title').val();
    var desc = $('#description').val();
    var due = $('#datepicker').val();
    var jsonListId = $('#list_box option:selected').attr('id');
    alert('addします。tiele：' + title + "due：" + due + "desc：" + desc + "trello_api_key：" + trelloApiKey + "trello_api_token：" + trelloApiToken + "List_id：" + jsonListId);

    //GASの関数をつかってカードを追加する※通常のhtmlからは呼べない。gasで作ったhtmlファイルからしか呼べないみたい・・・。
    google.script.run.addCard(trelloApiKey, trelloApiToken, jsonListId, title, desc, due);

  })

});
