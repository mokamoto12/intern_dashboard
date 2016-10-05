$(function () {
  //カレンダーで日付登録
  var trelloClient = new TrelloClient('Trello連携テスト');
  var registerTodo = new RegisterTodo();

  registerTodo.addDatePicker();
  registerTodo.addListOptions();
  registerTodo.addRegisterEvent();
});

var RegisterTodo = function () {
  // 必要なフィールドを追加していく
};

RegisterTodo.prototype.addDatePicker = function () {
  // 日付入力欄に.datepicker()する
};

RegisterTodo.prototype.addListOptions = function () {
  // Trelloからリスト一覧を取得しそれぞれoptionタグを作成する
  // <option id="リストのID">リストの名前</option>
  // 作成したタグはリストのselectタグに追加する
};

RegisterTodo.prototype.addRegisterEvent = function () {
  // ボタンがクリックされたら選択したリストに入力したタイトル、期限、説明のカードを追加する
  // 期限と説明はそれぞれ{desc: 説明, due: 期限}としてTrelloClient.prototype.postCardのoptionValに渡す
};
