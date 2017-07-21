'use strict';

$(document).ready(function() {
  $('.goingButton').click(function() {
    var user = $('body').data('user');
    if (!user) {
      window.location.href = 'http://localhost:3000/auth/facebook';
    } else {
      console.log('ajax request on the way');
    }
  });
});