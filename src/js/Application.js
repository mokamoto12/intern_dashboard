(function($){
  'use strict'
  $(function(){
    var date = new Date();
    var timer = new Timer(date, '#time');

    var leftStore = new Storage('leftStore');
    var leftList = new SortableList('#left_list');

    var rightStore = new Storage('rightStore');
    var rightList = new SortableList('#right_list');

    var widgetsList = new SortableList('#widgets_list');

    timer.updateTime();

    widgetsList.getAllItems().forEach(function (item) {
      if (!leftStore.hasItem(item) && !rightStore.hasItem(item)) {
        leftStore.pushNewItem(item);
      }
    });

    initProcess(leftList, leftStore);
    initProcess(rightList, rightStore);
    leftList.connect(rightList);
    rightList.connect(leftList);
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

