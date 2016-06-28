
app.component('gameWindow', {
    controller: function ($scope, dataAccess, hotkeys) {
        var shuffleArray = function (array) {
            var m = array.length, t, i;

            // While there remain elements to shuffle
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        };

        initGame = function () {
            $scope.sprawdz = 1; // 1,2,3,4
            $scope.wordIndex = 0;
            $scope.wiemCounter = 0;
            $scope.niewiemCounter = 0;

            $scope.words = dataAccess.connectArray('words');
            $scope.words = shuffleArray($scope.words);
        };

        $scope.wiem = function () {

            $scope.wiemCounter++;

            $scope.words[$scope.wordIndex].win++;
            $scope.words.$save($scope.wordIndex);

            nextWord();
        };

        $scope.niewiem = function () {

            $scope.niewiemCounter++;

            $scope.words[$scope.wordIndex].lost++;
            $scope.words.$save($scope.wordIndex);

            nextWord();
        };

        $scope.next = function () {

            $scope.words[$scope.wordIndex].refresh++;
            $scope.words.$save($scope.wordIndex);

            $scope.sprawdz++;
        };

        $scope.startGame = function () {
            initGame();
        };

        nextWord = function () {
            $scope.sprawdz = 1;
            if ($scope.words.length - 1 > $scope.wordIndex) {
                $scope.wordIndex++;
            } else {
                $scope.sprawdz = 4;
            }
        };

        hotkeys.bindTo($scope)
            .add({
                combo: 'left',
                callback: function () {
                    $scope.wiem();
                }
            })
            .add({
                combo: 'right',
                callback: function () {
                    $scope.niewiem();
                }
            })
            .add({
                combo: 'up',
                callback: function () {
                    if ($scope.sprawdz != 4)
                        $scope.next();
                    else
                        $scope.startGame();
                }
            });

        initGame();
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
        .when('/add_category', {
            controller: 'addCategoryCtrl',
            templateUrl: 'pages/add_category.html'
        })
        .when('/edit_word/:id', {
            controller: 'editWordCtrl',
            templateUrl: 'pages/add_word.html'
        })
        .otherwise({
            template: '<h1>Not Found</h1>'
        });
});

app.controller('appCtrl', ["$scope", "$location", "Auth", "dataAccess",
    function ($scope, $location, Auth, dataAccess) {

        saveDataUser = function () {
            var obj = dataAccess.connectObj('userData');

            obj.$loaded().then(function () {
                console.log(obj.email);
                obj.lastLogin = new Date().getTime();

                if (!obj.email) {
                    obj.email = Auth.$getAuth().email;
                    obj.refresh = 1;
                    obj.score = 0;

                } else {
                    obj.refresh++;
                }

                obj.$save();
            });
        };

        $scope.auth = Auth;
        $scope.auth.$onAuthStateChanged(function (authData) {
            $scope.userObj = authData;
            saveDataUser();
        });

        $scope.logout = function () {
            $scope.auth.$signOut();
        };

        $scope.pageClass = function (path) {
            return (path == $location.path()) ? 'active' : '';
        };

    }]);

app.controller('indexCtrl', function ($scope, $interval) {
    $interval(function () {
        $scope.time = new Date();
    }, 1000);
});

app.controller('learnCtrl', ["$scope",
    function ($scope) {

        $scope.mode;


    }
]);

app.controller('managerCtrl', ["$scope", "dataAccess", "selectedWord",
    function ($scope, dataAccess, selectedWord) {

        $scope.words = dataAccess.connectArray('words');

        $scope.deleteWord = function (index) {
            var item = $scope.words[index];
            $scope.words.$remove(item);
        };

        $scope.editWord = function (item) {
            selectedWord = item;
        };
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

app.controller('addWordCtrl', ["$scope", "dataAccess", "$alert",
    function ($scope, dataAccess, $alert) {

        var alert = $alert({
            title: 'Success!',
            content: 'Word added succesfully.',
            type: 'success',
            container: '#alertContainer',
            show: false,
            delay: {hide: 1000}
        });

        $scope.saveWord = function () {

            var list = dataAccess.connectArray('words');

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
                alert.show();

            }, function (error) {
                console.log("Error:", error);
            });
        };
    }
]);
app.controller('addCategoryCtrl', ["$scope", "$alert", "dataAccess",
    function ($scope, $alert, dataAccess) {

        var alert = $alert({
            title: 'Success!',
            content: 'Category added succesfully.',
            type: 'success',
            container: '#alertContainer',
            show: false,
            delay: {hide: 1000}
        });

        $scope.saveCategory = function () {

            var list = dataAccess.connectArray('categories');

            var categoryObj = {
                categoryName: $scope.category
            };

            list.$add(categoryObj).then(function (ref) {
                $scope.category = '';
                alert.show();
            });
        }
    }]
);

app.controller('editWordCtrl', ["$scope", "$routeParams", "dataAccess", "$alert",
    function ($scope, $routeParams, dataAccess, $alert) {

        var alert = $alert({
            title: 'Success!',
            content: 'Word updated succesfully.',
            type: 'success',
            container: '#alertContainer',
            show: false,
            delay: {hide: 1000}
        });

        var id = $routeParams.id;
        var list = dataAccess.connectArray('words');
        var word = list[id];

        $scope.first = word.first;
        $scope.second = word.second;

        $scope.saveWord = function () {

            word.first = $scope.first;
            word.second = $scope.second;
            list[id] = word;

            list.$save(word).then(function (ref) {
                alert.show();
            }).catch(function (error) {
                console.error("updated failed:", list);
            });
        }

    }]
);