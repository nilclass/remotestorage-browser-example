define([
  'jquery',
  'bootstrap',
  'remotestorage/remotestorage',
  'remotestorage/modules/root',
  './common',
  './tree',
  './settings'
], function($, _ignored, remoteStorage, root, common, tree, settings) {

  window.remoteStorage = remoteStorage;

  $(function() {

    tree.setLoading('/');
    tree.setLoading('/public/');

    var ready = false;

    remoteStorage.on('ready', function() {
      ready = true;

      tree.refresh();
    });

    remoteStorage.access.claim('root', 'rw').
      then(util.curry(remoteStorage.root.use, '/', true)).
      then(function() {
        remoteStorage.displayWidget();
        remoteStorage.schedule.disable();
      });

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

