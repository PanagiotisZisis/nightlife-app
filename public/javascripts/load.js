'use strict';

$(window).on('load', function() {
  $('.goingButton').each(function(i, obj) {
   if (/^[\s+]+$/.test($(obj).html())) {
    $(obj).html('0 Going');
   }
  });
});