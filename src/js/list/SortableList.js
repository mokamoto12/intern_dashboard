var SortableList = function (selector) {
  this.selector = selector;
  this.$list = $(selector);
};

SortableList.prototype.getAllItems = function () {
  return $.map(this.$list.children(), function (item) {
    return item.id;
  });
};

SortableList.prototype.display = function (selector) {
  this.$list.append($(selector));
};

SortableList.prototype.getSelector = function () {
  return this.selector;
};

SortableList.prototype.addSortable = function () {
  this.$list.sortable();
};

SortableList.prototype.update = function (callable) {
  this.$list.on("sortupdate", function(event, ui) {
    callable(event, ui);
  });
};

SortableList.prototype.connect = function (sortableList) {
  this.$list.sortable("option", "connectWith", sortableList.getSelector());
};

