define([
  'remotestorage/lib/store'
], function(store) {

  var debugLog = null;

  function renderDebugLog() {
    if(debugLog) {
      return debugLog;
    }
    var dataStore = store.getAdapter();
    
    var wrapper = $('<div class="debug-log table-striped">');
    debugLog = wrapper;
    wrapper.append('<h2>Debug Log</h2>');
    var table = $('<table>');
    var thead = $('<thead>');
    var row = $('<tr>');
    row.append('<th>Time</th>');
    row.append('<th>Method</th>');
    row.append('<th>Path</th>');
    thead.append(row);
    var tbody = $('<tbody>');
    table.append(thead);
    table.append(tbody);
    wrapper.append(table);
    dataStore.on('debug', function(event) {
      var r = $('<tr>');
      r.append($('<td>').text(event.timestamp.getTime()));
      r.append($('<td>').text(event.method));
      r.append($('<td>').text(event.path || ''));
      tbody.append(r);
    });
    return wrapper;
  }

  function buildView(parent) {
    parent.append($('<h1>Store Debugger</h1>'));
    parent.append(renderDebugLog());
  }

  return buildView;

});