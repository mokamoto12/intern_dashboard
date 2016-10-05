$(function () {
  //カレンダーで日付登録
  var trelloClient = new TrelloClient('Trello連携テスト');
  var registerTodo = new RegisterTodo(trelloClient, '#register_todo_submit', '#register_todo_list_box', '#register_todo_title', '#register_todo_desc', '#register_todo_due');

  registerTodo.addDatePicker();
  registerTodo.addListOptions();
  registerTodo.addRegisterEvent();
});

var RegisterTodo = function (client, submitSelector, listBoxSelector, titleSelector, descSelector, dueSelector) {
  this.client = client;
  this.$submit = $(submitSelector);
  this.SelectedListSelector = listBoxSelector + '>option:selected';
  this.$listBox = $(listBoxSelector);
  this.$title = $(titleSelector);
  this.$desc = $(descSelector);
  this.$due = $(dueSelector);
};

RegisterTodo.prototype.addDatePicker = function () {
  this.$due.datepicker();
};

RegisterTodo.prototype.addListOptions = function () {
  var self = this;
  this.client.fetchLists().done(function (lists) {
    lists.forEach(function (list) {
      self.$listBox.append('<option id="' + list.id + '">' + list.name + '</option>');
    });
  });
};

RegisterTodo.prototype.addRegisterEvent = function () {
  var self = this;
  this.$submit.on('click', function () {
    self.client.postCard($(self.SelectedListSelector).attr('id'), self.$title.val(), {
      desc: self.$desc.val(),
      due: self.$due.val()
    });
  });
};
