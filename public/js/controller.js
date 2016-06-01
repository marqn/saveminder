var app = angular.module('app', ['ngRoute']);

app.value('wordsObj', [
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
]);


app.component('gameButtons', {
    controller: function ($scope, wordsObj) {

        $scope.sprawdz = 1; // 1,2,3
        $scope.wordIndex = 0;
        $scope.wiemCounter = 0;
        $scope.niewiemCounter = 0;

        $scope.words = wordsObj;

        $scope.wiem = function () {
            $scope.sprawdz++;
            $scope.wiemCounter++;
        };

        $scope.niewiem = function () {
            $scope.sprawdz++;
            $scope.niewiemCounter++;
        };

        $scope.showHidden = function () {
            $scope.sprawdz++;
        };

        $scope.next = function () {
            $scope.sprawdz = 1;
            if(wordsObj.length - 1 > $scope.wordIndex) {
                $scope.wordIndex++;
            } else
            {
                $scope.sprawdz = 4;
            }
        };
    },
    bindings: {},
    templateUrl: 'components/game/game.html'
});

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

    $scope.pageClass = function (path) {
        return (path == $location.path()) ? 'active' : '';
    };
});

app.controller('indexCtrl', function ($scope) {

});

app.controller('learnCtrl', function ($scope, wordsObj) {
    $scope.mode;

    $scope.words = wordsObj;
});

app.controller('managerCtrl', function ($scope, wordsObj) {
    $scope.words = wordsObj;
});

app.controller('loginCtrl', function ($scope) {
    $scope.info = "login page";
});

app.controller('joinCtrl', function ($scope) {
    $scope.info = "join page";
});
