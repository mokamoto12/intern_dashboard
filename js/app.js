$(function () {
  var dashboard = new Dashboard(new WidgetStore(), new WidgetDom('#widgets', '#sortable_left', '#sortable_right'));
  dashboard.addNewWidgets();
  dashboard.dispatchWidgetToColumn();
  dashboard.displayWidgets();
  dashboard.addColumnEvent();
});




LocalStorageHelper = {
  getAllItem: function () {
    return Object.keys(localStorage).map(function (key) {
      return this.getItem(key);
    }, this);
  },

  getItem: function (key) {
    return JSON.parse(localStorage.getItem(key));
  },

  setItem: function (key, json) {
    return localStorage.setItem(key, JSON.stringify(json));
  },

  hasItem: function (key) {
    if (this.getItem(key) !== null) {
      return key;
    }
  },

  notHasItem: function (key) {
    if (this.getItem(key) === null) {
      return key;
    }
  },

  getKeys: function () {
    return Object.keys(localStorage);
  }
};




var WidgetStore = function () {
};

WidgetStore.prototype.getRank = function (key) {
  if (LocalStorageHelper.hasItem(key)) {
    return LocalStorageHelper.getItem(key).rank;
  }
  return null;
};

WidgetStore.prototype.getCol = function (key) {
  if (LocalStorageHelper.hasItem(key)) {
    return LocalStorageHelper.getItem(key).col;
  }
  return null;
};

WidgetStore.prototype.sortKeysByRank = function (keys) {
  var self = this;
  return keys.sort(function (val1, val2) {
    return self.sortRankCheck(val1, val2);
  })
};

WidgetStore.prototype.sortRankCheck = function (val1, val2) {
  if (LocalStorageHelper.getItem(val1).rank > LocalStorageHelper.getItem(val2).rank) {
    return 1;
  }
  return -1;
};

WidgetStore.prototype.getColumnKeys = function (col) {
  return LocalStorageHelper.getKeys().filter(function (key) {
    return LocalStorageHelper.getItem(key).col === col;
  });
};





var WidgetDom = function (selector, leftDisplay, rightDisplay) {
  this.selector = selector;
  this.leftDisplay = leftDisplay;
  this.rightDisplay = rightDisplay;
};

WidgetDom.prototype.getAllWidgetElements = function () {
  return $(this.selector + '>*');
};

WidgetDom.prototype.displayLeft = function (widgetIds) {
  widgetIds.map(function (widgetId) {
    $(this.leftDisplay).append($(this.selector + '>#' + widgetId));
  }, this);
};

WidgetDom.prototype.displayRight = function (widgetIds) {
  widgetIds.map(function (widgetId) {
    $(this.rightDisplay).append($(this.selector + '>#' + widgetId));
  }, this);
};

WidgetDom.prototype.addEvent = function () {
  var self = this;
  $(self.leftDisplay).sortable({
    connectWith: self.rightDisplay,
    update: function (e, ui) {
      self.updateWidgetRank();
    }
  });
  $(self.rightDisplay).sortable({
    connectWith: self.leftDisplay,
    update: function (e, ui) {
      self.updateWidgetRank();
    }
  });
};

WidgetDom.prototype.updateWidgetRank = function () {
  $(this.leftDisplay + '>*').map(function (i, elm) {
    LocalStorageHelper.setItem(elm.id, Object.assign(LocalStorageHelper.getItem(elm.id), {rank: i, col: 'left'}));
  });
  $(this.rightDisplay + '>*').map(function (i, elm) {
    LocalStorageHelper.setItem(elm.id, Object.assign(LocalStorageHelper.getItem(elm.id), {rank: i, col: 'right'}));
  });
};




var Dashboard = function (store, dom) {
  this.store = store;
  this.dom = dom;
  this.leftColumnWidgetId = [];
  this.rightColumnWidgetId = [];
};

Dashboard.prototype.addNewWidgets = function () {
  this.getNotRegisterWidgetIds().map(function (i, id) {
    LocalStorageHelper.setItem(id, {col:'left', rank:-1});
  }, this);
};

Dashboard.prototype.getNotRegisterWidgetIds = function () {
  return this.dom.getAllWidgetElements().map(function (i, elm) {
    return LocalStorageHelper.notHasItem(elm.id);
  }, this);
};

Dashboard.prototype.dispatchWidgetToColumn = function () {
  this.leftColumnWidgetId = this.store.sortKeysByRank(this.store.getColumnKeys('left'));
  this.rightColumnWidgetId = this.store.sortKeysByRank(this.store.getColumnKeys('right'));
};

Dashboard.prototype.displayWidgets = function () {
  this.dom.displayLeft(this.leftColumnWidgetId);
  this.dom.displayRight(this.rightColumnWidgetId);
};

Dashboard.prototype.addColumnEvent = function () {
  this.dom.addEvent();
};
