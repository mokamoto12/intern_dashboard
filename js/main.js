$(function () {
  var storage = new WidgetStorage(localStorage);

  storage.getNotRegisterWidgets('#widgets').map(function (i, id) {
    dispatchWidget(id, 'left');
    return id;
  });

//描画
  var leftItemKeys = storage.getKeys().filter(function (key) {
    return storage.getItem(key).col === 'left';
  });

  leftItemKeys = storage.sortKeysByRank(leftItemKeys);

  leftItemKeys.map(function (key) {
    $('#sortable_left').append($('#widgets>#' + key));
  });

  var rightItemKeys = storage.getKeys().filter(function (key) {
    return storage.getItem(key).col === 'right';
  });

  rightItemKeys = storage.sortKeysByRank(rightItemKeys);

  rightItemKeys.map(function (key) {
    $('#sortable_right').append($('#widgets>#' + key));
  });

  $("#sortable_left").sortable({
    connectWith: '#sortable_right',
    update: function (e, ui) {
      updateWidgetRank();
    }
  });
  $("#sortable_right").sortable({
    connectWith: '#sortable_left',
    update: function (e, ui) {
      updateWidgetRank();
    }
  });
});


LEFT_RANK = 0;
RIGHT_RANK = 0;

function dispatchWidget(id, col) {
  localStorage.setItem(id, JSON.stringify({
    rank: $('#sortable_' + col + '>*').length + LEFT_RANK,
    col: col,
  }));
  LEFT_RANK++;
}

function getJson(key) {
  return JSON.parse(localStorage.getItem(key));
}

var updateWidgetRank = function () {
  $('#sortable_left>*').map(function (i, elm) {
    localStorage.setItem(elm.id, JSON.stringify(Object.assign(getJson(elm.id), {rank: i, col: 'left'})));
  });
  $('#sortable_right>*').map(function (i, elm) {
    localStorage.setItem(elm.id, JSON.stringify(Object.assign(getJson(elm.id), {rank: i, col: 'right'})));
  });
};


var WidgetStorage = function (storage, domStorage) {
  this.storage = storage;
};

WidgetStorage.prototype.sortKeysByRank = function (keys) {
  var self = this;
  return keys.sort(function (val1, val2) {
    if (self.getItem(val1).rank < self.getItem(val2).rank) {
      return -1;
    }
    return 1;
  })
};

WidgetStorage.prototype.getKeys = function () {
  return Object.keys(this.storage);
};

WidgetStorage.prototype.getAllItem = function () {
  return Object.keys(this.storage).map(function (key) {
    return this.getItem(key);
  }, this);
};

WidgetStorage.prototype.hasItem = function (key) {
  return this.storage.getItem(key) !== null;
};

WidgetStorage.prototype.getItem = function (key) {
  return JSON.parse(this.storage.getItem(key));
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

WidgetStorage.prototype.getNotRegisterWidgets = function (selector) {
  var self = this;
  return $(selector + '>*').map(function (i, elm) {
    var id = elm.id;
    if (!self.hasItem(id)) {
      return id;
    }
  });
};
