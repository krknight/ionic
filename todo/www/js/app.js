// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

/*
The Projects factory handles saving and loading projects from local storage, and also lets us save and load
the last active project index.
 */
.factory('Projects', function() {
    return {
     all: function() {
       var projectString = window.localStorage['projects'];
       if(projectString) {
         return angular.fromJson(projectString);
       }
       return [];
     },
     save: function(projects) {
       window.localStorage['projects'] = angular.toJson(projects);
     },
     newProject: function(projectTitle) {
       // Add a new project
       return {
         title: projectTitle,
         tasks: []
       };
     },
     getLastActiveIndex: function() {
       return parseInt(window.localStorage['lastActiveProject']) || 0;
     },
     setLastActiveIndex: function() {
       window.localStorage['lastActiveProject'] = index;
     }
    }
  })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// $scope is the application object (the owner of application variables and functions)
  /*
   // $scope is the glue between the application controller and the view.
   // Both directives and controllers have reference to the scope but not each other.

  index.html (view)
  ----------
   <div ng-controller="MyController">
   Your name:
   |||||||||||||||||||||||||||||||||||||||
   <input type="text" ng-model="username">
   |||||||||||||||||||||||||||||||||||||||
   <button ng-click='sayHello()'>greet</button>
   <hr>
   {{greeting}}
   </div>

   script.js (application controller)
   ---------
   angular.module('scopeExample', [])
   .controller('MyController', ['$scope', function($scope) {
   ||||||||||||||||||||||||||
   $scope.username = 'World';
   |||||||||||||||||||||||||||

   $scope.sayHello = function() {
   $scope.greeting = 'Hello ' + $scope.username + '!';
   };
   }]);
   */
// ionicModal and ionicSideMenuDelegate are ionic services that you add to your controller
// $ionicModal is a service that instantiates the ionicModal controller
// The Modal is a content pane that can go over the user's main view temporarily.
// A modal will broadcast 'modal.shown', 'modal.hidden' and 'modal removed' from its originating scope

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // Testing data
  $scope.tasks = [
//    { title: 'Collect coins' },
//    { title: 'Eat mushrooms' },
//    { title: 'Get high enough to grab the flag' },
//    { title: 'Find the Princess' }
  ];

  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  // Load or initialize projects, there should by an ng-model='"projects" in index.html
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project,index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html',function(modal){$scope.taskModal = modal;}, {
      scope: $scope
//      animation: 'slide-in-up'
  });

  // Called when the form is submitted
  // <form ng-submit="createTask(task)">
  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // controller function closeNewTask()
  // <button class="button button-clear button-positive" ng-click="closeNewTask()">Cancel</button>
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  // controller function toggleProjects()
  // <button class="button button-icon" ng-click="toggleProjects()">
  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Try to create the first project, make suer to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});
