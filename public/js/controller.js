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
        if (authData)
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

app.controller('learnCtrl', function ($scope, wordsObj) {
    $scope.mode;

    $scope.words = wordsObj;
});

app.controller('managerCtrl', function ($scope, wordsObj) {
    $scope.words = wordsObj;
});

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

app.controller('addWordCtrl', ["$scope", "$firebaseArray", "$firebaseArray", "refFirebase", "Auth",
    function ($scope, $firebaseObject, $firebaseArray, refFirebase, Auth) {
        $scope.saveWord = function () {

            var idUser = Auth.$getAuth().uid;

            var ref = refFirebase.ref("users").child(idUser).child('words');

            var list = $firebaseArray(ref);

            var wordObj =
            {
                first: $scope.first,
                second: $scope.second,
                refresh: 0,
                win: 0,
                lost: 0,
                category: 1,
                data_added: Math.round(new Date().getTime() / 1000)
            };

            list.$add(wordObj).then(function (ref) {


                $scope.first = '';
                $scope.second = '';

            }, function (error) {
                console.log("Error:", error);
            });
        };
    }]);