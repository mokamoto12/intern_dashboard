$(function () {

  var domStorage = new DomStorage('#widgets');
  var storage = new WidgetStorage(localStorage, domStorage);
  storage.updateStorage();
  var leftDisplay = new WidgetDisplay('#sortable_left', storage);
  var rightDisplay = new WidgetDisplay('#sortable_right', storage);





  var selector = new Selector('#widgets', '#sortable_left', '#sortable_right');
  var leftWidgetStorage = new WidgetStorage('left');
  var rightWidgetStorage = new WidgetStorage('right');
  var leftDisplay = new WidgetDisplay('#sortable_left', leftWidgetStorage);
  var rightDisplay = new WidgetDisplay('#sortable_right', rightWidgetStorage);
  var storeHelper = new StoreHelper('#widgets');
  var store = new WidgetStore(storeHelper);

  store.dispatchWidget(leftDisplay);
  leftDisplay.setItem(store.getDisplayItem('left'));
  rightDisplay.setItem(store.getDisplayItem('right'));
  store.getNewWidgets().forEach(function (val, key) {
    if (leftDisplay.getAllItem().length > rightDisplay.getAllItem().length) {
      rightDisplay.setItem(val);
      return;
    }
    leftDisplay.setItem(val);
  });

  $("#sortable_left").sortable({
    connectWith: '#sortable_right',
    update: function (e, ui) {
      if(rightDisplay.hasNewWidget()) {
        rightDisplay.updateDisplay();
        return;
      }
      leftDisplay.updateDisplay();
    }
  });
  $("#sortable_right").sortable({
    connectWith: '#sortable_left',
    update: function (e, ui) {
      if (leftDisplay.hasNewWidget()) {
        rightDisplay.updateDisplay();
      }
    }
  });

  leftDisplay.displayWidgets();
  rightDisplay.displayWidgets();


});



var DomStorage = function (selector) {
  this.selector = selector;
};

DomStorage.prototype.getAllItem = function () {
  return $(this.selector + '>*').map(function (key, elm) {
    return elm.id;
  });
};

DomStorage.prototype.getElement = function (key) {
  return $(this.selector + '>' + key);
};



var WidgetStorage = function (storage, domStorage) {
  this.storage = storage;
  this.leftRank = this.getMaxRank();
};

WidgetStorage.prototype.getAllItem = function () {
  Object.keys(this.storage).map(function (i, key) {
    return JSON.parse(this.storage.getItem(key));
  });
};

WidgetStorage.prototype.hasItem = function (key) {
  return this.storage.getItem(key) !== null;
};

WidgetStorage.prototype.getItem = function (key) {
  return this.storage.getItem(key);
};

WidgetStorage.prototype.setItem = function (key, json) {
  return this.storage.setItem(key, JSON.stringify(json));
};

WidgetStorage.prototype.getRank = function (key) {
  if (this.storage.hasItem(key)) {
    return this.storage.getItem(key).rank;
  }
  return null;
};

WidgetStorage.prototype.getCol = function (key) {
  if (this.storage.hasItem(key)) {
    return this.storage.getItem(key).col;
  }
  return null;
};



var DomWidget = function (storage, widgetStore, leftCol, rightCol) {
  this.storage = storage;
  this.store = widgetStore;
  this.left = leftCol;
  this.right = rightCol;
};

DomWidget.prototype.getWidgets = function () {
  return $(this.store + '>*');
};

DomWidget.prototype.setWidgets = function (widgets) {
  var self = this;
  widgets.map(function (widget) {
    self.setWidget(widget);
  });
};

DomWidget.prototype.setWidget = function (widget) {

};



var DomWidgetMaterial = function (selector) {
  this.selector = selector;
};

DomWidgetMaterial.prototype.getAllItem = function () {
  return $(this.selector + '>*');
};

DomWidgetMaterial.prototype.getItem = function (id) {
  return $(this.selector + '>#' + id);
};

DomWidgetMaterial.prototype.popItem = function (id) {
  return $(this.selector + '>#' + id).remove();
};



var WidgetStore = function (store) {
  this.store = store;
};

WidgetStore.prototype.getAllItem = function () {
  return this.store.getAllItem();
};

WidgetStore.prototype.getItem = function (id) {
  return this.store.getItem(id);
};

WidgetStore.prototype.popItem = function (id) {
  return this.store.popItem(id);
};



var Widget = function (name) {
  this.id = name;
  this.col = this.getCol();
  this.rank = this.getRank();
};

Widget.prototype.getCol = function () {
  if (StorageHelper.hasItem(this.name)) {
    return StorageHelper.getJsonItem(this.name).col;
  }
  return;
}

Widget.prototype.getNotRegisterWidgets = function () {
  return $('#widgets>*').filter(function (key, elm) {
    return localStorage.getItem(elm.id) === null;
  });
};

Widget.prototype.registerWidget = function (widget) {
  var setCol =
    StorageHelper.setJsonItem(widget.id, {rank: this.leftRank, col: setCol});
};



var DomTimer = function (date, selector) {
  this.date = date;
  this.selector = selector;
};

DomTimer.prototype.setTime = function () {
  $(this.selector).innerHTML = this.date.toString();
};



var Dashboard = function (timer, leftDisplay, rightDisplay) {
  this.timer = timer;
  this.leftDisplay = leftDisplay;
  this.rightDisplay = rightDisplay;
};

Dashboard.prototype.displayWidgets = function () {
  this.leftDisplay.displayWidgets();
  this.rightDisplay.displayWidgets();
};

Dashboard.prototype.setTime = function () {
  this.timer.setTime();
};



var WidgetDisplay = function (selector, storage) {
  this.selector = selector;
  this.storage = storage;
};

WidgetDisplay.prototype.saveWidgetId = function (widget) {
  this.storage.setWidgets(widget);
};

WidgetDisplay.prototype.displayWidgets = function () {
  var self = this;
  self.storage.getAllItem().map(function (widget) {
    $(self.selector).append(widget);
  });
};