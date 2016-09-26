(function ($) {
  'use strict';
  $(function () {
    var dashboard = new Dashboard(new WidgetStore(), new WidgetDom('#widgets', '#sortable_left', '#sortable_right', '.widget'));
    dashboard.addTime('#time');
    dashboard.addNewWidgets();
    dashboard.dispatchWidgetToColumn();
    dashboard.displayWidgets();
    dashboard.addColumnEvent();
  });




  var LocalStorageHelper = {
    getItem: function (key) {
      try {
        JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return localStorage.getItem(key);
      }
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
      return Object.keys(localStorage).filter(function (keys) {
        return keys !== 'boardId';
      });
    }
  };




  var WidgetStore = function () {
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





  var WidgetDom = function (selector, leftDisplay, rightDisplay, widgetSelector) {
    this.selector = selector;
    this.leftDisplay = leftDisplay;
    this.rightDisplay = rightDisplay;
    this.widgetSelector = widgetSelector;
  };

  WidgetDom.prototype.getAllWidgetElements = function () {
    return $(this.selector + '>' + this.widgetSelector);
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
    $(this.leftDisplay + '>' + this.widgetSelector).map(function (i, elm) {
      LocalStorageHelper.setItem(elm.id, Object.assign(LocalStorageHelper.getItem(elm.id), {rank: i, col: 'left'}));
    });
    $(this.rightDisplay + '>' + this.widgetSelector).map(function (i, elm) {
      LocalStorageHelper.setItem(elm.id, Object.assign(LocalStorageHelper.getItem(elm.id), {rank: i, col: 'right'}));
    });
  };




  var Dashboard = function (store, dom) {
    this.store = store;
    this.dom = dom;
    this.leftColumnWidgetId = [];
    this.rightColumnWidgetId = [];
  };

  Dashboard.prototype.addTime = function (timeSelector) {
    var date = new Date();
    $(timeSelector).html('更新時 : ' + date.toLocaleString());
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
}(jQuery));
