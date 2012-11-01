define([
  './tree',
  './grid'
], function(tree, grid) {

  function openPath(path, extra) {
    tree.select(path);
    grid.openPath(path, extra);
  }
  
  function jumpTo(path) {
    history.pushState(null, null, '#!' + path);
    openPath(path);
  }

  return {
    jumpTo: jumpTo,
    openPath: openPath,
    createObjectURL: window.URL ? window.URL.createObjectURL.bind(window.URL) : window.webkitURL.createObjectURL.bind(window.webkitURL)
  }

});
