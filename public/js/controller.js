// Firebase config.
var config = {
    'authDomain': 'saveminder.firebaseapp.com',
    'apiKey': 'AIzaSyBMkJ2KFyRANZuyTnGJcBQBs3Uy3sxxkxI',
};
// FirebaseUI config.
var uiConfig = {
    'signInOptions': [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

// Initialize the FirebaseUI Widget using Firebase.
var appFirebase = firebase.initializeApp(config);
var auth = appFirebase.auth();
var ui = new firebaseui.auth.AuthUI(auth);
// The start method will wait until the DOM is loaded.

/*window.onload = function() {
 initApp()
 };*/

var app = angular.module('app', ['ngRoute', 'firebase']);

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
            controller: 'joinCtrl',
            templateUrl: 'pages/join.html'
        })
        .otherwise({
            template: '<h1>Not Found</h1>'
        });
});

app.controller('appCtrl', function ($scope, $location) {

    $scope.nameUser;

    $scope.pageClass = function (path) {
        return (path == $location.path()) ? 'active' : '';
    };

    initApp = function () {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var uid = user.uid;
                var providerData = user.providerData;

                user.getToken().then(function (accessToken) {
                    $scope.userObj = user;
                    console.log("$scope = " + $scope.userObj.displayName);
                    /*document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
                     document.getElementById('quickstart-sign-in').textContent = 'Sign out';
                     document.getElementById('quickstart-account-details').textContent = JSON.stringify({
                     displayName: displayName,
                     email: email,
                     emailVerified: emailVerified,
                     photoURL: photoURL,
                     uid: uid,
                     accessToken: accessToken,
                     providerData: providerData
                     }, null, '  ');*/
                });
            } else {
                // User is signed out.
                /*document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
                 document.getElementById('quickstart-sign-in').textContent = 'Sign in';
                 document.getElementById('quickstart-account-details').textContent = 'null';*/
            }
        }, function (error) {
            console.log(error);
        });
    };

    initApp();


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

app.controller('loginCtrl', function ($scope, settings) {
    $scope.info = "login page";

    console.log("isAddedFirebaseContainer:" + settings.isAddedFirebaseContainer);
    // if (!settings.isAddedFirebaseContainer) {
    //     settings.isAddedFirebaseContainer = true;
    ui.start('#firebaseui-auth-container', uiConfig);
    // }


});

app.controller('joinCtrl', function ($scope) {
    $scope.info = "join page";
});
