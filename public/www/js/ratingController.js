angular.module('ratingApp')
    .controller('HintCtrl', function ($scope, $http, $ionicLoading) {
        var LS_UID_KEY = "oc_rating_user_id";
        var backendURL = "http://ec2-54-93-187-220.eu-central-1.compute.amazonaws.com";


        $scope.userID = localStorage.getItem(LS_UID_KEY);

        if ($scope.userID == null) {
            $scope.userID = new Date().getTime();
            localStorage.setItem(LS_UID_KEY, $scope.userID);
        }

        //register user with backend
        $http.post(backendURL + "/api/user/" + $scope.userID)
            .success(function(data, status, headers, config){
                //TODO signal success
            })
            .error(function(data, status, headers, config){
                //TODO signal error
            });

        $scope.comment = {
            user: $scope.userID,
            body: ""
        };

        $scope.sendComment = function () {
            //send comment to backend
            $scope.showLoading();
            $http.post(backendURL + "/api/user/" + $scope.userID + "/comment", $scope.comment)
                .success(function(data, status, headers, config){
                    $scope.comment.body = "";
                    $scope.hideLoading();
                    //TODO signal success
                })
                .error(function(data, status, headers, config){
                    //TODO signal error
                    $scope.hideLoading();
                });
        };

        $scope.latestRating = 0;
        $scope.sendRating = function(rating){
            //send rating to backend
            if($scope.latestRating != rating){
                $scope.showLoading();
                $http.put(backendURL + "/api/user/" + $scope.userID + "/theory/"+rating)
                    .success(function(data, status, headers, config){
                        $scope.latestRating = rating;
                        $scope.hideLoading();
                    })
                    .error(function(data, status, headers, config){
                        //TODO signal error
                        $scope.hideLoading();
                    });
            }
        };



        $scope.showLoading = function() {
            $ionicLoading.show({
                template: 'sending...'
            });
        };
        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };


    });
