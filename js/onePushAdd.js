$(function () {
  //カレンダーで日付登録
  $("#datepicker").datepicker();
  $("#datepicker").datepicker("option", "showOn", 'button');
  $("#datepicker").datepicker("option", "buttonImageOnly", true);
  $("#datepicker").datepicker("option", "buttonImage", 'ico_calendar.png');

  var trello_api_key = "dca0005de0d4861551bde47e1246b4d0";
  var trello_api_token = "ae910fa0a066cafd5e15c5a78fa8442416a2b1db191f11c787e8836a7ebbc6e8";
  var trello_username = "user09300969";
  var title = $('#title').val();
  var day = $('#datepicker').val();
  var desc = $('#description').val();

  //ボード名を取得。
  $.ajax({

    type: "GET",
    dataType: "jsonp",
    url: "https://trello.com/1/members/" + trello_username + "/boards?key=" + trello_api_key + "&token=" + trello_api_token + "&fields=name",

  }).done(function (data) {

    alert(data[0].name);
    var arr_board = {};
    for (var i = 0; i < data.length; i++) {
      arr_board[data[i].id] = data[i].name;
      $('#board_box').append('<option id="' + data[i].id + '">' + data[i].name + '</option>');
    }

    //ボード名が選ばれたらリスト名を取得
    $('#board_box').on('change',

        function () {
          alert('cahnge');
          $('#list_box').empty();
          $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "https://trello.com/1/boards/" + $('#board_box option:selected').attr('id') + "/lists?key=" + trello_api_key + "&token=" + trello_api_token + "&fields=name",
          }).done(function (list) {
            alert(list[0].name);
            var arr_list = {};
            for (var i = 0; i < list.length; i++) {
              arr_list[list[i].id] = list[i].name;
              $('#list_box').append('<option id="' + list[i].id + '">' + list[i].name + '</option>');
            }

            var board = $('#board_box option:selected').attr('id');
            var list = $('#list_box option:selected').attr('id');
            var url = "https://trello.com/1/lists/" + list + "/cards?key=" + trello_api_key + "&token=" + trello_api_token + "&name=" + title + "&due=null";
            $('form').attr('action', url);

          }).fail(function () {
            alert('list error');
          });

        });
  }).fail(function () {

    alert('board error');

  });

  //新しいカードをpost
  /*$('#add_btn').on('click', function(){


   post_trello(title,day,desc,board,list)

   function post_trello(title,day,desc,board,list){
   var post_url = "https://trello.com/1/cards?key"+trello_api_key+"&token="+trello_api_token+"&idList="+$('#list_box option:selected').attr('id')+
   "&name="+title+"&idBoard="+board+"&idList="+list+"&description="+desc;

   }
   })*/

});
