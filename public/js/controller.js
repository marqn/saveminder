var app = angular.module('app', ['ngRoute', 'firebase']);


app.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
        return $firebaseAuth();
    }
]);

app.value("settings",
    {
        isAddedFirebaseContainer: false
    }
);

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


app.component('gameWindow', {
    controller: function ($scope, wordsObj) {

        $scope.sprawdz = 1; // 1,2,3,4
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
            if (wordsObj.length - 1 > $scope.wordIndex) {
                $scope.wordIndex++;
            } else {
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
            templateUrl: 'pages/login.html'
        })
        .when('/join', {
            controller: 'signInCtrl',
            templateUrl: 'pages/sign_in.html'
        })
        .otherwise({
            template: '<h1>Not Found</h1>'
        });
});

app.controller('appCtrl', function ($scope, $location) {

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(authData) {
        $scope.authData = authData;
        console.log(authData);
    });

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

app.controller("loginCtrl", ["$scope", "Auth", function ($scope, Auth) {
    $scope.info = "login page";

    $scope.createUser = function () {
        $scope.message = null;
        $scope.error = null;

        Auth.$createUserWithEmailAndPassword(
            $scope.email,
            $scope.password
        ).then(function (userData) {
            $scope.message = "User created with uid: " + userData.uid;
        }).catch(function (error) {
            $scope.error = error;
        });
    };

    $scope.removeUser = function () {
        $scope.message = null;
        $scope.error = null;

        Auth.$removeUser({
            email: $scope.email,
            password: $scope.password
        }).then(function () {
            $scope.message = "User removed";
        }).catch(function (error) {
            $scope.error = error;
        });
    };
}
]);

/*
 app.controller('loginCtrl', function ($scope, settings) {
 $scope.info = "login page";

 // console.log("isAddedFirebaseContainer:" + settings.isAddedFirebaseContainer);
 // if (!settings.isAddedFirebaseContainer) {
 //     settings.isAddedFirebaseContainer = true;
 // ui.start('#firebaseui-auth-container', uiConfig);
 // }
 });
 */

app.controller('signInCtrl', ["$scope", "Auth", function ($scope, Auth) {
    $scope.info = "join page";

    $scope.isLogged = function () {
        var authData = Auth.$getAuth();

        console.log(authData);

        if (authData) {
            console.log("Logged in as:", authData.uid);
        } else {
            console.log("Logged out");
        }
    };



    $scope.loggin = function () {
        Auth.$signInWithPopup("google").then(function (authData) {
            console.log("Logged in as:", authData.uid);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(authData) {
        $scope.authData = authData;
        console.log(authData);
    });
}]);
