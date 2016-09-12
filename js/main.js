$(function () {
  $("#sortable_left").sortable({connectWith: '#sortable_right'});
  $("#sortable_right").sortable({connectWith: '#sortable_left'});


  var widgetMaterial = new DomWidgetMaterial('#widgets');
  var widgets = widgetMaterial.getAllMaterial().map(function(key, val){
    return new Widget(val);
  });
  var widgetStore = new WidgetStore(widgets);

  var storeHelper = new DomStoreHelper('#widgets');
  var storage = new LocalStorageStorage(localStorage);

  var store = new WidgetStore(storeHelper);
  var storage = new WidgetStorage(storageHelper);
  store.setNewWidgets(store.getAllItem());
  display_left.setItem(store.popItem());
  display_left.showItems();
  display_right.showItems();

  var dashboard = new Dashboard(display_left, display_right);

  var domWidget = new DomWidget(storage, '#widgets', '#sortable_left', '#sortable_right');
  domWidget.setStorageItem(domWidget.getWidgets());
  storage.registerWidget(domWidget.getNotRegisterWidgets());
  domWidget.displayWidgets(storage);
  var widgetObjs = domWidget.getWidgets().map(function (key, elm) {
    return new Widget(elm.id);
  });

  domWidget.setDom();

  widget.getNotRegisterWidgets().map(function (widgetElm) {
    widget.registerWidget(widgetElm);
  });

  var leftDisplay = new WidgetDisplay('#sortable_left');
  var rightDisplay = new WidgetDisplay('#sortable_right');
  var timer = new DomTimer(new Date(), '#time');
  var Dashboard = new Dashboard(timer, leftDisplay, rightDisplay);
  Dashboard.displayWidgets();
  Dashboard.setTime();
});

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



var LocalStorageStorageHelper = function (storage) {
  this.storage = storage;
};

var WidgetStorage = function (storage) {
  this.storage = storage;
};

WidgetStorage.prototype.hasItem = function (key) {
  return this.storage.getItem(key) !== null;
};

WidgetStorage.prototype.getItem = function (key) {
  return JSON.parse(this.storage.getItem(key));
};

WidgetStorage.prototype.setItem = function (key, json) {
  this.storage.setItem(key, JSON.stringify(json));
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
