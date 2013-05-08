define([
  'jquery',
  'bootstrap',
  'remotestorage/remoteStorage',
  'remotestorage-root',
  './common',
  './tree',
  './settings'
], function($, _ignored, remoteStorage, root, common, tree, settings) {

  window.remoteStorage = remoteStorage;

  var util = remoteStorage.util;

  remoteStorage.util.silenceAllLoggers();
  remoteStorage.util.unsilenceLogger('store::localstorage');

  $(function() {

    tree.setLoading('/');
    tree.setLoading('/public/');

    var ready = false;

    remoteStorage.on('ready', function() {
      ready = true;

      $(document.body).addClass('connected');
      try {
      tree.refresh();
      } catch(exc) { console.error('exc', exc.stack); }
    });

    remoteStorage.on('disconnect', function() {
      $(document.body).removeClass('connected');
    });

    remoteStorage.claimAccess('root', 'rw');
    remoteStorage.root.release('/');
    remoteStorage.displayWidget('remotestorage-connect');
    remoteStorage.schedule.disable();

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
        remoteStorage.on('ready', action);
      }
    });
    
  });

});

