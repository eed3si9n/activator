/*
 Copyright (C) 2014 Typesafe, Inc <http://typesafe.com>
 */
define(['widgets/modals/modals'], function(modals) {

  function browse(location) {
    return $.ajax({
      url: '/api/local/browse',
      type: 'GET',
      dataType: 'json',
      data: {
        location: location
      }
    }).error(showError("Can not browse "+location+"."));
  }

  // Reveal / open
  function open(location){
    return $.ajax({
      url: '/api/local/open',
      type: 'GET',
      dataType: 'text',
      data: { location: location }
    }).error(showError("Can not reveal "+location+"."));
  }

  // Get file's content
  function show(location) {
    return $.ajax({
      url: '/api/local/show',
      type: 'GET',
      data: {
        location: location
      }
    }).error(showError("Can not open "+location+"."));
  }

  function save(location, code) {
    return $.ajax({
      url: '/api/local/save',
      type: 'PUT',
      dataType: 'text',
      data: {
        location: location,
        content: code
      }
    }).error(showError("Can not save "+location+"."));
  }

  function rename(location, newName) {
    return $.ajax({
      url: '/api/local/rename',
      type: 'PUT',
      dataType: 'text',
      data: {
        location: location,
        newName: newName
      }
    }).error(showError("Can not rename "+location+"."));
  }

  function create(location, isDirectory, content) {
    return $.ajax({
      url: '/api/local/create',
      type: 'PUT',
      dataType: 'text',
      data: {
        location: location,
        isDirectory: isDirectory,
        content: content || ""
      }
    }).error(showError("Can not create "+location+"."));
  }

  function _delete(location, isDirectory) {
    return $.ajax({
      url: '/api/local/delete',
      type: 'PUT',
      dataType: 'text',
      data: {
        location: location
      }
    }).error(showError("Can not delete "+location+"."));
  }

  function showError(err){
    return function() {
      modals.show({
        title: "Oops. Something went wrong",
        text: err,
        cancel: "hide"
      })
    }
  }

  function buildItems(item) {
    item.callback = function() {
      window.location.hash = item.url;
    }
    return item;
  }

  function search(keywords) {
    var url = '/app/' + window.serverAppModel.id + '/search/' + keywords;
    return $.ajax({
      url: url,
      dataType: 'json'
    }).error(showError("We could not search for:" + keywords)).pipe(function (data) {
      return data.map(buildItems) || [];
    });
  }

  // Path utilities
  function relative(path) {
    return path.replace(window.serverAppModel.location,"");
  }
  function absolute(path) {
    return window.serverAppModel.location + path;
  }

  return {
    search: search,
    browse: browse,
    open: open,
    show: show,
    save: save,
    rename: rename,
    create: create,
    delete: _delete,
    relative: relative,
    absolute: absolute
  };

});
