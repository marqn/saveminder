app.component('gameWindow', {
    controller: function ($scope, dataAccess, hotkeys, ArrayUtil, gameConfiguration) {

        $scope.elapsedTime;

        // console.log(gameConfiguration);

        $scope.$on('timer-stopped', function (event, data) {
            $scope.elapsedTime = data.millis;
        });

        initGame = function () {
            $scope.sprawdz = 1; // 1,2,3,4
            $scope.wordIndex = 0;
            $scope.wiemCounter = 0;
            $scope.niewiemCounter = 0;
            $scope.progress = 0;

            var list = dataAccess.connectArray('words');

            list.$loaded()
                .then(function () {

                    $scope.words = ArrayUtil.shuffleArray(list);

                });
            $scope.$broadcast('timer-start');
        };

        $scope.getFirst = function () {
            var option = 'first';
            if(gameConfiguration.hideType == "hideFirst")
            {
                option = 'second';
            }

            if(gameConfiguration.hideType == "mixed")
            {
                option = 'second';
            }

            return getWord(option);
        };
        
        $scope.getSecond = function () {
            var option = 'second';
            if(gameConfiguration.hideType == "hideFirst")
            {
                option = 'first';
            }

            if(gameConfiguration.hideType == "mixed")
            {
                option = 'first';
            }

            return getWord(option);
        };

        getWord = function (type) {

            var index = $scope.wordIndex;

            if(type == 'first')
            {
                return $scope.words[index].first;
            }
            if(type == 'second')
            {
                return $scope.words[index].second;
            }

            return $scope.words[index].second;
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

            console.log($scope.elapsedTimer);
            $scope.words[$scope.wordIndex].refresh++;
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
            }
            $scope.wordIndex++;
            $scope.progress = Math.floor(($scope.wordIndex / gameConfiguration.numberOfWords) * 100);
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