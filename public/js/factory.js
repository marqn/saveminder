var app = angular.module('app', ['ngRoute', 'firebase', 'mgcrea.ngStrap', 'cfp.hotkeys']);

app.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
        return $firebaseAuth();
    }
]);

app.factory("refFirebase", function () {
    return firebase.database();
});

app.factory("dataAccess", ["Auth", "refFirebase", "$firebaseArray", "$firebaseObject",
    function (Auth, refFirebase, $firebaseArray, $firebaseObject) {
        return {
            connectArray: function (path) {
                var idUser = Auth.$getAuth().uid;
                var ref = refFirebase.ref("users").child(idUser).child(path);

                var list = $firebaseArray(ref);
                return list;
            },
            connectObj: function (path) {
                var idUser = Auth.$getAuth().uid;
                var ref = refFirebase.ref("users").child(idUser).child(path);

                var obj = $firebaseObject(ref);
                return obj;
            },
            connectAuth: function () {
                return Auth.$getAuth();
            }
        }
    }
]);

app.value("selectedWord", null);
