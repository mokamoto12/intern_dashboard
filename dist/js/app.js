(function ($) {
  'use strict';
  $(function () {
    var widgetDom = new WidgetDom('#widgets', '#left_column', '#right_column', '.widget');
    var dashboard = new Dashboard(widgetDom);
    // インスタンスを使って行う処理
    // 日時追加
    // 新しいウィジェットをストレージに登録
    // 左右にウィジェットを割り当てる
    // 割り当てたウィジェットを表示する
    // 並び替えられるようにする
  });




  var Dashboard = function (dom) {
    this.dom = dom;
    this.leftColumnWidgetId = [];
    this.rightColumnWidgetId = [];
    this.initialPosition = {col: 'left', rank: -1};
  };


  /**
   * 現在の日時をHTML要素に追加する
   * @param {string} timeSelector 更新時間を追加する要素セレクタ
   */
  Dashboard.prototype.addTime = function (timeSelector) {
    // 要素に時間を表示する
  };



  /**
   * ストレージにウィジェットIDとデフォルトの列、ランクを設定する
   */
  Dashboard.prototype.registerNewWidgets = function () {
    this.getNotRegisterWidgetIds().forEach(function (id) {
      // idとthis.initialPositionをストレージに保存する
    }, this);
  };

  /**
   * ストレージに登録されていないウィジェットを取得する
   * @return {Array.<string>} ['sample1_widget', 'sample2_widget', ...]
   */
  Dashboard.prototype.getNotRegisterWidgetIds = function () {
    return this.dom.getAllWidgetElements().map(function (elm) {
      return LocalStorageHelper.notHasItem(elm.id);
    }, this);
  };



  /**
   * ストレージに登録してあるウィジェットをそれぞれ左右に振り分ける
   */
  Dashboard.prototype.dispatchWidgetToColumn = function () {
    // col が left  のウィジェットを並び替えて this.leftColumnWidgetId  に代入する
    // col が right のウィジェットを並び替えて this.rightColumnWidgetId に代入する
  };

  /**
   * 引数で指定した列のウィジェットIDを取得する
   * @param  {string} col 取得したいカラム、'left'か'right'
   * @return {Array.<string>} 指定した列のID ['sample1_widget', 'sample2_widget', ...]
   */
  Dashboard.prototype.getStorageKeysByColumn = function (col) {
    return LocalStorageHelper.getKeys().filter(function (key) {
      return LocalStorageHelper.getItem(key).col === col;
    });
  };

  /**
   * ウィジェットIDをランク順に並び替える
   * @param {Array.<string>} keys 並び替えるIDの配列
   * @return {Array.<string>} 並び替えたID ['sample1_widget', 'sample2_widget', ...]
   */
  Dashboard.prototype.sortStorageKeysByRank = function (storageKeys) {
    var self = this;
    return storageKeys.sort(function (val1, val2) {
      return self.sortRankCheck(val1, val2);
    });
  };



  /*
   * 左右のウィジェットを表示させる
   */
  Dashboard.prototype.displayWidgets = function () {
    this.dom.displayLeft(this.leftColumnWidgetId);
    this.dom.displayRight(this.rightColumnWidgetId);
  };



  /**
   * イベントを追加する
   */
  Dashboard.prototype.addColumnEvent = function () {
    this.dom.addEvent();
  };

  Dashboard.prototype.sortRankCheck = function (val1, val2) {
    if (LocalStorageHelper.getItem(val1).rank > LocalStorageHelper.getItem(val2).rank) {
      return 1;
    }
    return -1;
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

  WidgetDom.prototype.displayLeft = function (widgetIds) {
    // this.widgetBoxの中のwidgetIdsをthis.$leftDisplayに追加する
  };

  WidgetDom.prototype.displayRight = function (widgetIds) {
    // this.widgetBoxの中のwidgetIdsをthis.$rightDisplayに追加する
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

  WidgetDom.prototype.updateWidgetRank = function () {
    this.getLeftWidgets().each(function (idx, elm) {
      LocalStorageHelper.setItem(elm.id, {rank: idx, col: 'left'});
    });
    this.getRightWidgets().each(function (idx, elm) {
      LocalStorageHelper.setItem(elm.id, {rank: idx, col: 'right'});
    });
  };

  /**
   * 左カラムの要素一覧を返す
   * @return {jQuery}
   */
  WidgetDom.prototype.getLeftWidgets = function () {
    return $(this.leftDisplay + '>' + this.widgetSelector);
  };

  /**
   * 右カラムの要素一覧を返す
   * @return {jQuery}
   */
  WidgetDom.prototype.getRightWidgets = function () {
    return $(this.rightDisplay + '>' + this.widgetSelector);
  };

  WidgetDom.prototype.getAllWidgetElements = function () {
    return this.$allWidgets.get();
  };




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
}(jQuery));
