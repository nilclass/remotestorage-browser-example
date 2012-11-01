
define(['../remoteStorage'], function(remoteStorage) {

  var moduleName = 'issues';

  defineModule(moduleName, function(privateClient, publicClient) {

    publicClient.declareType('issue', {
      "description": "An issue to be discussed.",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Human readable title, as displayed in a list",
          "required": true
        },
        "status": {
          "type": "string",
          "description": "Current status of the issue",
          "enum": [
            'open',
            'closed'
          ]
        },
        "body": {
          "type": "string",
          "description": "Text of the issue. May contain HTML markup"
        }
      }
    });

    var Project = function(projectName) {
      this.name = projectName;
      publicClient.use(this.makePath(''));
    }

    Project.prototype = {
      makePath: function(path) {
        return this.name + '/' + path;
      },

      listIssues: function() {
        return publicClient.getAll(this.makePath('issues/'));
      },

      close: function() {
        baseClient.release(this.makePath(''));
      }
    }

    return {
      openProject: function(projectName) {
        return new Project(projectName);
      }
    }
  });

  return remoteStorage[moduleName];

});