var app = angular.module('app', ['ngRoute', 'firebase']);


app.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
        return $firebaseAuth();
    }
]);

app.factory("refFirebase", function () {
        return firebase.database();
    }
);

app.factory('getListOfWords', ["Auth", "refFirebase", "$firebaseArray",
    function (Auth, refFirebase, $firebaseArray) {
        var idUser = Auth.$getAuth().uid;
        var ref = refFirebase.ref("users").child(idUser).child('words');

        var list = $firebaseArray(ref);

        console.log("idUser: " + idUser);

        return list;
    }
]);

app.component('gameWindow', {
    controller: function ($scope, getListOfWords) {

        $scope.sprawdz = 1; // 1,2,3,4
        $scope.wordIndex = 0;
        $scope.wiemCounter = 0;
        $scope.niewiemCounter = 0;

        $scope.words = getListOfWords;

        $scope.wiem = function () {
            $scope.sprawdz++;
            $scope.wiemCounter++;

            $scope.words[$scope.wordIndex].win++;
            $scope.words.$save($scope.wordIndex);
        };

        $scope.niewiem = function () {
            $scope.sprawdz++;
            $scope.niewiemCounter++;

            $scope.words[$scope.wordIndex].lost++;
            $scope.words.$save($scope.wordIndex);
        };

        $scope.next = function () {

            $scope.words[$scope.wordIndex].refresh++;
            $scope.words.$save($scope.wordIndex);

            $scope.sprawdz = 1;
            if ($scope.words.length - 1 > $scope.wordIndex) {
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
        .when('/sign_up', {
            controller: 'createUserCtrl',
            templateUrl: 'pages/sign_up.html'
        })
        .when('/sign_in', {
            controller: 'signInCtrl',
            templateUrl: 'pages/sign_in.html'
        })
        .when('/add_word', {
            controller: 'addWordCtrl',
            templateUrl: 'pages/add_word.html'
        })
        .otherwise({
            template: '<h1>Not Found</h1>'
        });
});

app.controller('appCtrl', ["$scope", "$location", "Auth", function ($scope, $location, Auth) {

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function (authData) {
        $scope.userObj = authData;
        if (authData && authData.uid)
            console.log("onAuthStateChanged: " + authData.uid);
    });

    $scope.logout = function () {
        $scope.auth.$signOut();
    };

    $scope.pageClass = function (path) {
        return (path == $location.path()) ? 'active' : '';
    };

}]);

app.controller('indexCtrl', function ($scope) {

});

app.controller('learnCtrl', ["$scope",
    function ($scope) {

        $scope.mode;

    }
]);

app.controller('managerCtrl', ["$scope", "getListOfWords",
    function ($scope, getListOfWords) {

        $scope.words = getListOfWords;

        $scope.deleteWord = function (index) {
            var item = $scope.words[index];
            $scope.words.$remove(item);
        }
    }
]);

app.controller("createUserCtrl", ["$scope", "Auth", function ($scope, Auth) {
    $scope.info = "Sign up";

    $scope.createUser = function () {
        Auth.$createUserWithEmailAndPassword(
            $scope.email,
            $scope.password
        ).then(function (userData) {
                console.log("User " + userData.uid + " created successfully!");
            }).then(function (authData) {
                console.log("Logged in as:", authData.uid);
            }).catch(function (error) {
                console.error("Error: ", error);
            });
    };

}
]);

app.controller('signInCtrl', ["$scope", "Auth", function ($scope, Auth) {
    $scope.info = "Login";

    $scope.auth = Auth;

    $scope.isLogged = function () {
        var authData = Auth.$getAuth();

        console.log(authData);

        if (authData) {
            console.log("Logged in as:", authData.email);
        } else {
            console.log("Logged out");
        }
    };


    $scope.loggIn = function () {
        Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function (authData) {
            console.log("Logged in as:", authData.email);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.loginFromGoogle = function () {
        Auth.$signInWithPopup("google").then(function (authData) {
            console.log("Logged in as:", authData.email);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.loginFromFacebook = function () {
        Auth.$signInWithPopup('facebook').then(function (authData) {
            console.log("Logged in as:", authData);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };
}]);

app.controller('addWordCtrl', ["$scope", "getListOfWords",
    function ($scope, getListOfWords) {
        $scope.saveWord = function () {

            var list = getListOfWords;

            var wordObj =
            {
                first: $scope.first,
                second: $scope.second,
                refresh: 0,
                win: 0,
                lost: 0,
                category: 1,
                data_added: Math.round(new Date().getTime())
            };

            list.$add(wordObj).then(function (ref) {

                $scope.first = '';
                $scope.second = '';

            }, function (error) {
                console.log("Error:", error);
            });
        };
    }
]);