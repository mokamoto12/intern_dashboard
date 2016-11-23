var Timer = function (date, selector) {
  this.date = date;
  this.$timer = $(selector);
};

Timer.prototype.updateTime = function () {
  this.$timer.html(this.date.toLocaleString());
};
