define([
  'jquery',
  'bootstrap',
  'remotestorage/remoteStorage',
  'remotestorage/modules/root',
  './common',
  './tree',
  './settings',
], function($, _ignored, remoteStorage, root, common, tree, settings) {

  var util = remoteStorage.util;

  $(function() {

    //remoteStorage.util.setLogLevel('debug');
    remoteStorage.util.silenceAllLoggers();

    tree.setLoading('/');
    tree.setLoading('/public/');

    root.use('/', true);

    var ready = false;

    remoteStorage.onWidget('state', function(state) {
      if(state == 'connected' || state == 'busy') {
        $(document.body).addClass('connected');
      } else if(state == 'disconnected') {
        $(document.body).removeClass('connected');
      }
    });

    remoteStorage.onWidget('ready', function() {
      ready = true;
      tree.load('/');
      tree.load('/public/');

      tree.restoreOpened();
    });

    root.on('conflict', function(event) {
      console.error('conflict', event);
    });

    root.on('change', function() {
      console.log("EVENT", arguments);
    });

    remoteStorage.claimAccess('root', 'rw');
    remoteStorage.displayWidget('remotestorage-connect');

    $(window).bind('popstate', function() {
      var md = document.location.hash.match(/^#!(.+?)(?:!(.+)|)$/);
      var action;
      if(md) {
        console.log("DISPATCH", 'path', md[1], 'extra', md[2]);
        if(md[1][0] == '!') {
          action = util.curry(settings.display, md[1].slice(1));
        } else {
          action = util.curry(common.openPath, md[1], md[2]);
        }
      } else {
        action = util.curry(common.jumpTo, '/');
      }
      if(ready) {
        action();
      } else {
        remoteStorage.onWidget('ready', action);
      }
    });
    
  });

});

