'use strict';

$(document).ready(function() {
  $('.goingButton').click(function() {
    var userID = $('body').data('userid');
    var locationID = $(this).data('locationid');
    if (!userID) {
      window.location.href = 'http://localhost:3000/auth/facebook';
    } else {
      console.log(userID, locationID);
      var data = {
        locationID: locationID,
        userID: userID
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(data) {
          console.log(data);
          location.reload(true);
        }
      });
    }
  });
});