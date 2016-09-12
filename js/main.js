$(function () {
  $("#sortable_left").sortable({connectWith: '#sortable_right'});
  $("#sortable_right").sortable({connectWith: '#sortable_left'});
});
