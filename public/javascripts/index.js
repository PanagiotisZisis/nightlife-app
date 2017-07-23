'use strict';

$(document).ready(function() {
  $('.goingButton').click(function() {
    var userID = $('body').data('userid');
    var locationID = $(this).data('locationid');
    if (!userID) {
      window.location.href = 'https://enigmatic-forest-46409.herokuapp.com/auth/facebook';
    } else {
      var data = {
        locationID: locationID,
        userID: userID
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'https://enigmatic-forest-46409.herokuapp.com/',
        success: function(data) {
          location.reload(true);
        }
      });
    }
  });
});