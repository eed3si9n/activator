/*
 Copyright (C) 2014 Typesafe, Inc <http://typesafe.com>
 */
define([
  './tasks',
  'services/ajax'
], function (
    tasks,
    ajax) {

    // plugin information
    var backgroundRunPluginFileLocation = "/project/sbt-ui.sbt";
    var backgroundRunPluginFileContent = "// This plugin represents functionality that is to be added to sbt in the future\n\n" +
      "addSbtPlugin(\"com.typesafe.sbtrc\" % \"ui-interface-0-13\" % \"1.0-d5ba9ed9c1d31e3431aeca5e429d290b56cb0b14\")";
    var uiFileEchoSettings = "\n\nfork in run := true";

    var echoPluginFileLocation = "/project/inspect.sbt";
    var echoPluginFileContent = "// This plugin runs apps with the \"echo\" trace infrastructure which backs up the Inspect functionality in Activator\n\n" +
      "addSbtPlugin(\"com.typesafe.sbt\" % \"sbt-echo\" % \"0.1.7\")";

    // Is this safe to do, i.e. is the location and name always the same for an Activator project?
    var buildFileLocation = "/build.sbt";
    var buildFileEchoSettings = "\n\nechoSettings";

    var addingEchoFile = ko.observable(false);
    var addingBackgroundFile = ko.observable(false);
    var editingBuildFile = ko.observable(false);

    // On start, we ensure that we have a background.sbt file and the corresponding config in build.sbt
    checkFileContent(serverAppModel.location+backgroundRunPluginFileLocation, backgroundRunPluginFileContent, function() {
      addingEchoFile(true);
    });
    checkFileContent(serverAppModel.location+buildFileLocation, uiFileEchoSettings, function() {
      editingBuildFile(true);
    }, true);

    var echoReady = ko.computed(function() {
      return (tasks.applicationReady() && addingEchoFile() && addingBackgroundFile() && editingBuildFile());
    });

    function echoInstalledAndReady(callback){
      checkFileContent(serverAppModel.location+echoPluginFileLocation, echoPluginFileContent, function() {
        addingBackgroundFile(true);
      });
      checkFileContent(serverAppModel.location+buildFileLocation, buildFileEchoSettings, function() {
        editingBuildFile(true);
      }, true);

      echoReady() && callback();
      ko.once(echoReady, function(ready) {
        if (ready){
          callback();
        }
      });
    }

    function checkFileContent(path, content, callback, appendTofile){
      return $.ajax({
        url: '/api/local/show',
        type: 'GET',
        dataType: 'text',
        data: { location: path }
      }).error(function(e) {
        // File is not here / can't be opened
        ajax.create(path, false, content).then(callback);
      }).success(function(data) {
        // File is here
        if (data.indexOf(content) >= 0){
          callback();
        } else {
          ajax.save(path, appendTofile?data+content:content).success(callback);
        }
      })
    }

    return {
      echoInstalledAndReady: echoInstalledAndReady,
      addingEchoFile:        addingEchoFile,
      addingBackgroundFile:  addingBackgroundFile,
      editingBuildFile:      editingBuildFile,
      echoReady:             echoReady
    };
});
