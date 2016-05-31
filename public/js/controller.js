var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'indexCtrl',
            templateUrl: 'pages/index.html'
        })
        .when('/learn', {
            controller: 'learnCtrl',
            templateUrl: 'pages/learn.html'
        })
        .when('/word-manager', {
            controller: 'managerCtrl',
            templateUrl: 'pages/manager.html'
        })
        .when('/login', {
            controller: 'loginCtrl',
            templateUrl: 'pages/join.html'
        })
        .when('/join', {
            controller: 'joinCtrl',
            templateUrl: 'pages/join.html'
        })
        .otherwise({
            template: '<h1>Not Found</h1>'
        });
});

app.controller('appCtrl', function ($scope, $location) {

    $scope.words = [
        {
            first: 'facilitate',
            second: 'ułatwić',
            win: 0,
            lost: 0,
            data_added: 1464635337,
            category: 1,
            refresh: 0
        },
        {
            first: 'flip',
            second: 'przerzucać, kartkować',
            win: 0,
            lost: 0,
            data_added: 1464635337,
            category: 1,
            refresh: 0
        }
    ];

    $scope.pageClass = function (path) {
        return (path == $location.path()) ? 'active' : '';
    };
});

app.controller('indexCtrl', function ($scope) {

});

app.controller('learnCtrl', function ($scope) {

});

app.controller('managerCtrl', function ($scope) {
    $scope.info = "manager wyrazów";
});

app.controller('loginCtrl', function ($scope) {
    $scope.info = "login page";
});

app.controller('joinCtrl', function ($scope) {
    $scope.info = "join page";
});
