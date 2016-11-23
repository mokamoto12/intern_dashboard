var Storage = function (name) {
  this.name = name;
};

Storage.prototype.setItem = function (item) {
  localStorage.setItem(this.name, item);
};

Storage.prototype.getAllItems = function () {
  var item = localStorage.getItem(this.name);
  return (item === null) ? [] : item.split(',');
};

Storage.prototype.pushItem = function (item) {
  this.setItem(this.getAllItems().concat(item));
};

Storage.prototype.hasItem = function (item) {
  return this.getAllItems().includes(item);
};

Storage.prototype.clear = function () {
  localStorage.removeItem(this.name);
};

