define([
  '../util', './pending', '../../vendor/IndexedDBShim'
], function(util, pendingAdapter, _) {

  var IndexedDBStore = function(indexedDB) {
    this.idb = indexedDB;
    this.connect();
  };

  IndexedDBStore.prototype = util.extend({

    connect: function() {}

  }, pendingAdapter);

  return function(indexedDB) {
    return new IndexedDBStore(indexedDB || (
      (typeof(window) !== 'undefined' ? window : global).indexedDB
    ));
  };
});
