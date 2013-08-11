define([
  './common',
], function(common) {

  function display(action) {
    var content = $('#content');
    switch(action) {
    default:
      content.html('<h1>Settings (TODO)</h1>');
    }
  }

  return {

    display: display

  }

});
