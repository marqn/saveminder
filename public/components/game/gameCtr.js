app.component('gameWindow', {
    controller: function ($scope, dataAccess, hotkeys, ArrayUtil, gameConfiguration) {

        $scope.elapsedTime;
        $scope.firstWordReff;
        $scope.secondWordReff;

        $scope.$on('timer-stopped', function (event, data) {
            $scope.elapsedTime = data.millis;
        });

        var mixedOptionObj = {
            repeat: 0,
            value: false
        };

        initGame = function () {
            $scope.sprawdz = 1; // 1,2,3,4
            $scope.wordIndex = 0;
            $scope.wiemCounter = 0;
            $scope.niewiemCounter = 0;
            $scope.progress = 0;

            var list = dataAccess.connectArray('words');

            list.$loaded()
                .then(function () {

                    if(gameConfiguration.modeGame == 'all')
                        $scope.words = ArrayUtil.shuffleArray(list);

                    if(gameConfiguration.modeGame == 'random')
                        $scope.words = ArrayUtil.shuffleArray(list);

                    if(gameConfiguration.modeGame == 'raiting')
                    {
                        $scope.words = list;
                        $scope.words = ArrayUtil.sortByBadRaiting($scope.words);
                    }

                    if(gameConfiguration.modeGame == 'wonder')
                    {
                        $scope.words = list;
                        $scope.words = ArrayUtil.sortByMuchLongerWonder($scope.words);
                    }

                    if(gameConfiguration.modeGame == 'last')
                    {
                        $scope.words = list;
                        var start = gameConfiguration.allWordsNumber - (gameConfiguration.numberOfWords);
                        $scope.words.splice(0, start);
                        $scope.words = ArrayUtil.shuffleArray($scope.words);
                    }

                    setWordIntoView();
                });
            $scope.$broadcast('timer-start');
        };

        getWord = function (option) {
            if (gameConfiguration.hideType == "hideFirst") {
                return returnWord(reverseType(option));
            }
            if (gameConfiguration.hideType == "mixed") {

                if (mixedOptionObj.repeat > 1) {
                    mixedOptionObj.repeat = 0;
                    mixedOptionObj.value = randomBool();
                }

                mixedOptionObj.repeat++;

                if (mixedOptionObj.value)
                    return returnWord(reverseType(option));
                else
                    return returnWord(option);
            }

            return returnWord(option);
        };

        reverseType = function (option) {

            if (option == "first")
                return 'second';
            else
                return 'first';

        };

        returnWord = function (type) {
            var index = $scope.wordIndex;

            if (type == 'first') {
                return $scope.words[index].first;
            }
            if (type == 'second') {
                return $scope.words[index].second;
            }
        };

        randomBool = function () {
            var randomNumber = Math.random() >= 0.5;
            return randomNumber;
        };

        $scope.wiem = function () {

            $scope.wiemCounter++;

            if (!$scope.words[$scope.wordIndex].elapsedTime)
                $scope.words[$scope.wordIndex].elapsedTime = $scope.elapsedTime;
            else
                $scope.words[$scope.wordIndex].elapsedTime += $scope.elapsedTime;

            $scope.words[$scope.wordIndex].win++;
            $scope.words.$save($scope.wordIndex);

            nextWord();
        };

        $scope.niewiem = function () {

            $scope.niewiemCounter++;

            if (!$scope.words[$scope.wordIndex].elapsedTime)
                $scope.words[$scope.wordIndex].elapsedTime = $scope.elapsedTime;
            else
                $scope.words[$scope.wordIndex].elapsedTime += $scope.elapsedTime;

            $scope.words[$scope.wordIndex].lost++;
            $scope.words.$save($scope.wordIndex);

            nextWord();
        };

        $scope.next = function () {

            $scope.$broadcast('timer-stop');

            var wordItem = $scope.words[$scope.wordIndex];

            wordItem.refresh++;
            $scope.words.$save($scope.wordIndex);

            $scope.sprawdz++;
        };

        $scope.startGame = function () {
            initGame();
        };

        nextWord = function () {
            $scope.sprawdz = 1;

            if (gameConfiguration.numberOfWords - 1 == $scope.wordIndex) {
                $scope.sprawdz = 4;
            }
            else {
                $scope.$broadcast('timer-start');
                $scope.wordIndex++;
                setWordIntoView();
            }


            $scope.progress = Math.floor(($scope.wordIndex / gameConfiguration.numberOfWords) * 100);
        };

        setWordIntoView = function () {
            $scope.firstWordReff = getWord('first');
            $scope.secondWordReff = getWord('second');
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