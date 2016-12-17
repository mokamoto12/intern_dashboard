(function($){
  'use strict'
  $(function(){
    var date = new Date();
    var timer = new Timer(date, '#time');

    timer.updateTime();

    var leftStore = new Storage('leftStore');
    var leftList = new SortableList('#left_list');

    var rightStore = new Storage('rightStore');
    var rightList = new SortableList('#right_list');

    var widgetsList = new SortableList('#widgets_list');

    widgetsList.getAllItems().forEach(function (item) {
      if (!leftStore.hasItem(item) && !rightStore.hasItem(item)) {
        leftStore.pushItem(item);
      }
    });

    initProcess(leftList, leftStore);
    initProcess(rightList, rightStore);
    leftList.connect(rightList);
    rightList.connect(leftList);

    var trelloClient = new TrelloClient('Trello連携テスト');
    var achieveRateWidget = new AchieveRateWidget(trelloClient, '#achieve_rate');
    trelloClient.fetchLists().done(function (lists) {
      achieveRateWidget.displayRate(achieveRateWidget.calcRate('done', lists));
    });

    var store = new BookmarkStore(trelloClient, 'ブックマーク');
    var bookmarkWidget = new BookmarkWidget(store, 'ブックマーク', '#bookmark_submit', '#bookmark_target', '#bookmark_list');
    bookmarkWidget.init();
    bookmarkWidget.addBookmarkFunction();

    var mindMapBoardName = 'sandbox_mindmap';
    var mindMapTrelloClient = new TrelloClient(mindMapBoardName);
    var mindMapWidget = new MindMapWidget(mindMapTrelloClient, 'マインドマップ');
    mindMapWidget.init();

    var registerTodo = new RegisterTodo(trelloClient, '#register_todo_submit', '#register_todo_list_box', '#register_todo_title', '#register_todo_desc', '#register_todo_due');
    registerTodo.addDatePicker();
    registerTodo.addListOptions();
    registerTodo.addRegisterEvent();

    var searchWidgetDom = new SearchWidgetDom('#search_word', '#search_result');
    var searchWidgetSorter = new SearchWidgetSorter('#search_result', 'search_sort_btn_active', 'search_result_list', 'search_result_card', 'search_label', 'search_due');
    var searchWidget = new SearchWidget(trelloClient, searchWidgetDom, searchWidgetSorter);
    searchWidget.addSearchFunction();
    searchWidgetSorter.addSortFunction('#search_sort_list', '#search_sort_label', '#search_sort_due');
  });

  function initProcess (sortableList, store) {
    store.getAllItems().forEach(function (item) {
      sortableList.display('#' + item);
    });
    sortableList.addSortable();
    sortableList.update(function () {
      store.clear();
      sortableList.getAllItems().forEach(function (item) {
        store.pushItem(item);
      });
    });
  };
})(jQuery);

