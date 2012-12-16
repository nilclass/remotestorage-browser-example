define([
  './common',
  './syncDebugger',
  './storeDebugger'
], function(common, syncDebugger, storeDebugger) {

  function display(action) {
    var content = $('#content');
    switch(action) {
    case 'sync':
      content.html('');
      syncDebugger(content);
      break;
    case 'store':
      content.html('');
      storeDebugger(content);
      break;
    default:
      content.html('<h1>Settings (TODO)</h1>');
    }
  }

  return {

    display: display

  }

});
