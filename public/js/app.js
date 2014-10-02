'use strict';

var app = angular.module('appirioApp',['ngRoute','controllers','ui.autocomplete','ui.bootstrap','bootstrap','AAFServices','matchmedia-ng','taiPlaceholder','ngTable','ui.calendar']);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', function ($rootScope,$location,$window) {
    $rootScope.location = $location;
    $rootScope.goto = function (path) {
        $rootScope.isExpand = false;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }else { // Go to the specified path
            $location.path(path);
        }
    };
}]);

app.config(["$routeProvider","$locationProvider",
    function($routeProvider){
        $routeProvider
            .when("/challenges",{
                templateUrl: "partials/challenge-list-view.html",
                controller : "tableController"

            }).when("/challenges/:challengeId/edit",{
                templateUrl: "partials/challenge-edit-view.html"
            
            }).when("/challenges/:challengeId/submissions",{
                templateUrl: "partials/challenge-submission-view.html",
                controller : "tableController"
            
            }).when("/challenges/:challengeId/submissions/:submissionId/scorecard",{
                templateUrl: "partials/challenge-scorecard-view.html",
                controller : "tableController"
            
            }).when("/challenges/:challengeId/results",{
                templateUrl: "partials/challenge-results-view.html",
                controller : "tableController"
            
            }).when("/card-view",{
                templateUrl: "partials/card-view.html",
                controller : "cardController"
            
            }).when("/schedule-view",{
                templateUrl: "partials/schedule-view.html",
                controller : "scheduleController"
            
            }).otherwise({
                redirectTo: '/challenges'
            });
    }
]);