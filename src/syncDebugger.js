define([
  'remotestorage/lib/util',
  'remotestorage/lib/sync',
  'remotestorage/lib/schedule',
  'remotestorage/lib/store'
], function(util, sync, schedule, store) {

  var settings = util.getSettingStore('remotestorage-browser:sync-debugger');

  function toggleButton(testFn, labelA, actionA, labelB, actionB, setting) {
    var button = $('<button>');
    var action;
    function updateState() {
      var state = !!testFn();
      settings.set(setting, state);
      if(state) {
        action = actionA;
        button.html(labelA);
      } else {
        action = actionB;
        button.html(labelB);
      }
    }
    button.click(function() {
      action(); updateState();
    });
    var initial = !!testFn();
    var v = settings.get(setting);
    if(typeof(v) !== 'undefined') {
      if(v && (!initial)) {
        actionB();
      } else if((! v) && initial) {
        actionA();
      }
      updateState();
    }
    return button;
  }

  function renderState() {
    var wrapper = $('<div class="state">');
    wrapper.append($('<h2>Sync State</h2>'));

    wrapper.append($('<strong>State:</strong>'));
    var stateLabel = $('<em>');
    stateLabel.text(sync.getState());
    sync.on('state', function(state) {
      stateLabel.text(state);
    });
    wrapper.append(stateLabel);

    wrapper.append('<br/>');

    wrapper.append($('<strong>Tasks:</strong>'));
    var tasksLabel = $('<em>');
    setInterval(function() {
      tasksLabel.text(String(sync.getQueue().length));
    }, 500);
    wrapper.append(tasksLabel);

    return wrapper;
  }

  function renderSchedule() {
    var wrapper = $('<div class="schedule">');
    wrapper.append($('<h2>Schedule</h2>'));

    wrapper.append(toggleButton(
      schedule.isEnabled,
      'Disable', schedule.disable,
      'Enable', schedule.enable,
      'schedule-state'
    ));

    var table = $('<table>');
    var head = $('<thead>');
    var row = $('<tr>');
    row.append($('<th>Path</th>'));
    row.append($('<th>Interval</th>'));
    head.append(row);
    var body = $('<tbody>');
    var sched = schedule.get();
    for(var path in sched) {
      row = $('<tr>');
      row.append($('<td>').text(path));
      row.append($('<td>').text(sched[path]));
      body.append(row);
    }
    table.append(head);
    table.append(body);
    wrapper.append(table);
    return wrapper;
  }

  function renderNodeTable() {
    var wrapper = $('<div class="node-table">');
    var nodeTable = $('<table class="table-striped">');
    var head = $('<thead>');
    var row = $('<tr>');
    row.append($('<th>Path</th>'));
    row.append($('<th>Timestamp</th>'));
    row.append($('<th>Last Synced</th>'));
    row.append($('<th>Start force?</th>'));
    row.append($('<th>Start force tree?</th>'));
    row.append($('<th>Start access?</th>'));
    head.append(row);
    nodeTable.append(head);

    var tbody = $('<tbody>');
    nodeTable.append(tbody);

    function refreshTable() {
      tbody.html('');
      function insertNode(path) {
        console.log('insertNode', path);
        return store.getNode(path).then(util.curry(renderNode, path));
      }
      function renderNode(path, node) {
        console.log('renderNode', path, node);
        var row = $('<tr>');
        row.append($('<td>').text(path));
        row.append($('<td>').text(node.timestamp));
        row.append($('<td>').text(node.lastUpdatedAt));
        row.append($('<td>').text(node.startForce));
        row.append($('<td>').text(node.startForceTree));
        row.append($('<td>').text(node.startAccess));
        var actions = $('<td>');
        if(util.isDir(path)) {
          var syncOneButton = $('<button>').text('Sync');
          syncOneButton.click(function() {
            sync.partialSync(path, 1, refreshTable);
          });
          actions.append(syncOneButton);
        }
        row.append(actions)
        tbody.append(row);
        if(util.isDir(path) && node.data) {
          return util.asyncEach(Object.keys(node.data), function(key) {
            return insertNode(path + key);
          });
        }
      }
      return insertNode('/');
    }

    refreshTable();

    wrapper.append('<h1>Node table</h1>');
    var refreshButton = $('<button>').text('Refresh');
    refreshButton.click(function() {
      refreshButton.attr('disabled', true);
      refreshTable().
        then(function() {
          refreshButton.attr('disabled', false);
        });
    });
    wrapper.append(refreshButton);
    wrapper.append(nodeTable);
    return wrapper;
  }

  function renderSyncLog() {
    var wrapper = $('<div class="sync-log">');
    wrapper.append('<h2>Sync Log</h2>');
    var table = $('<table>');
    var thead = $('<thead>');
    var row = $('<tr>');
    row.append('<th>Time</th>');
    row.append('<th>Path</th>');
    row.append('<th>Method</th>');
    row.append('<th>Message</th>');
    thead.append(row);
    var tbody = $('<tbody>');
    table.append(thead);
    table.append(tbody);
    wrapper.append(table);
    sync.on('debug', function(event) {
      var r = $('<tr>');
      r.append($('<td>').text(event.timestamp.getTime()));
      r.append($('<td>').text(event.path));
      r.append($('<td>').text(event.method));
      r.append($('<td>').text(event.message));
      tbody.append(r);
    });
    return wrapper;
  }

  function buildView(parent) {

    parent.append($('<h1>Sync Debugger</h1>'));
    parent.append(renderSchedule());
    parent.append(renderState());
    parent.append(renderSyncLog());
    parent.append(renderNodeTable());
  }

  return buildView;

});
