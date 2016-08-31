var app = angular.module('app', ['ngRoute', 'firebase', 'mgcrea.ngStrap', 'cfp.hotkeys', 'timer']);

const DEFAULT_WORDS_NUMBER_LIMIT = 5;

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
            }
        }
    }
]);

app.factory("ArrayUtil", function () {
    return {
        shuffleArray: function (array) {
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
        }
    }
});

app.factory("gameConfiguration", function () {
    return {
        hideType: 'hideSecond',
        modeGame: '',
        category: '',
        numberOfWords: DEFAULT_WORDS_NUMBER_LIMIT,

        getHideType: function (val) {
            if (val != this.hideType)
                return "btn btn-info btn-lg";
            else
                return "btn btn-success btn-lg";
        },
        setHideType: function (val) {
            this.hideType = val;
        },
        getModeGame: function (val) {
            if (val != this.modeGame)
                return "btn btn-info btn-lg";
            else
                return "btn btn-success btn-lg";
        },
        setModeGame: function (val) {
            this.modeGame = val;
        }
    };
});

app.factory("managerModel", function () {
    var state; // wordState, categoryState

    return {
        setState: function (val) {
            state = val;
        },
        getState: function () {
            if (!state)
                state = "wordState";
            return state;
        },
        setWordState: function () {
            state = 'wordState';
            return state;
        },
        setCategoryState: function () {
            state = 'categoryState';
            return state;
        },
        isWordState: function () {
            if (state == 'wordState')
                return true;
            else
                return false;
        },
        isCategoryState: function () {
            if (state == 'categoryState')
                return true;
            else
                return false;
        }

    };
});


app.factory("selectButton", function (modeGame) {

    return {
        getClass: function (val) {

            if (val != modeGame.getModeGame())
                return "btn btn-info btn-lg";
            else
                return "btn btn-success btn-lg";
        }
    }

});

app.factory("alert", ["$alert", function ($alert) {
    return {
        setText: function (text) {
            var alert = $alert({
                title: 'Success!',
                content: text,
                type: 'success',
                container: '#alertContainer',
                show: false,
                delay: {hide: 1000}
            });
            return alert;
        }
    }
}]);


/*
 app.factory('gamePage', function () {
 var index = 1;
 return {
 nextPage: function () {
 index++;
 if (index > 4) {
 index = 1;
 }
 console.log(index);
 return index;
 },
 endPage: function () {
 index = 4;
 console.log(index);
 return index;
 },
 getPage: function () {
 console.log(index);
 return index;
 }
 };
 });
 */

app.value("selectedItem", null);
