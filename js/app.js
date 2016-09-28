(function ($) {
  'use strict';
  $(function () {
    var widgetDom = new WidgetDom('#widgets', '#left_column', '#right_column', '.widget');
    var dashboard = new Dashboard(widgetDom);
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



  var WidgetDom = function (widgetsBoxSelector, leftDisplaySelector, rightDisplaySelector, widgetSelector) {
    this.widgetBox = widgetsBoxSelector;
    this.widgetSelector = widgetSelector;
    this.leftDisplay = leftDisplaySelector;
    this.rightDisplay = rightDisplaySelector;
    this.$leftDisplay = $(leftDisplaySelector);
    this.$rightDisplay = $(rightDisplaySelector);
    this.$allWidgets = $(widgetsBoxSelector + '>' + widgetSelector);
  };

  WidgetDom.prototype.getAllWidgetElements = function () {
    return this.$allWidgets.get();
  };

  WidgetDom.prototype.displayLeft = function (widgetIds) {
    widgetIds.forEach(function (widgetId) {
      this.$leftDisplay.append($(this.widgetBox + '>#' + widgetId));
    }, this);
  };

  WidgetDom.prototype.displayRight = function (widgetIds) {
    widgetIds.forEach(function (widgetId) {
      this.$rightDisplay.append($(this.widgetBox + '>#' + widgetId));
    }, this);
  };

  WidgetDom.prototype.addEvent = function () {
    var self = this;
    self.$leftDisplay.sortable({
      connectWith: self.rightDisplay,
      update: function (e, ui) {
        self.updateWidgetRank();
      }
    });
    self.$rightDisplay.sortable({
      connectWith: self.leftDisplay,
      update: function (e, ui) {
        self.updateWidgetRank();
      }
    });
  };

  WidgetDom.prototype.getLeftWidgets = function () {
    return $(this.leftDisplay + '>' + this.widgetSelector);
  };

  WidgetDom.prototype.getRightWidgets = function () {
    return $(this.rightDisplay + '>' + this.widgetSelector);
  };

  WidgetDom.prototype.updateWidgetRank = function () {
    this.getLeftWidgets().each(function (idx, elm) {
      LocalStorageHelper.setItem(elm.id, {rank: idx, col: 'left'});
    });
    this.getRightWidgets().each(function (idx, elm) {
      LocalStorageHelper.setItem(elm.id, {rank: idx, col: 'right'});
    });
  };




  var Dashboard = function (dom) {
    this.dom = dom;
    this.leftColumnWidgetId = [];
    this.rightColumnWidgetId = [];
  };

  Dashboard.prototype.addTime = function (timeSelector) {
    var date = new Date();
    $(timeSelector).html('更新時 : ' + date.toLocaleString());
  };

  Dashboard.prototype.addNewWidgets = function () {
    this.getNotRegisterWidgetIds().forEach(function (id) {
      LocalStorageHelper.setItem(id, {col:'left', rank:-1});
    }, this);
  };

  Dashboard.prototype.getNotRegisterWidgetIds = function () {
    return this.dom.getAllWidgetElements().map(function (elm) {
      return LocalStorageHelper.notHasItem(elm.id);
    }, this);
  };

  Dashboard.prototype.dispatchWidgetToColumn = function () {
    this.leftColumnWidgetId = this.sortKeysByRank(this.getColumnKeysByStorage('left'));
    this.rightColumnWidgetId = this.sortKeysByRank(this.getColumnKeysByStorage('right'));
  };

  Dashboard.prototype.displayWidgets = function () {
    this.dom.displayLeft(this.leftColumnWidgetId);
    this.dom.displayRight(this.rightColumnWidgetId);
  };

  Dashboard.prototype.addColumnEvent = function () {
    this.dom.addEvent();
  };

  Dashboard.prototype.sortKeysByRank = function (keys) {
    var self = this;
    return keys.sort(function (val1, val2) {
      return self.sortRankCheck(val1, val2);
    })
  };

  Dashboard.prototype.sortRankCheck = function (val1, val2) {
    if (LocalStorageHelper.getItem(val1).rank > LocalStorageHelper.getItem(val2).rank) {
      return 1;
    }
    return -1;
  };

  Dashboard.prototype.getColumnKeysByStorage = function (col) {
    return LocalStorageHelper.getKeys().filter(function (key) {
      return LocalStorageHelper.getItem(key).col === col;
    });
  };
}(jQuery));
