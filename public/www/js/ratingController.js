angular.module('ratingApp')
    .controller('HintCtrl', function ($scope, $http) {
        var LS_UID_KEY = "oc_rating_user_id";
        var backendURL = "http://ec2-54-93-187-220.eu-central-1.compute.amazonaws.com";


        $scope.userID = localStorage.getItem(LS_UID_KEY);

        if ($scope.userID == null) {
            $scope.userID = new Date().getTime();
            localStorage.setItem(LS_UID_KEY, $scope.userID);
        }

        $scope.comment = {
            user: $scope.userID,
            body: ""
        };

        $scope.sendComment = function () {
            //send comment to backend
            $http.post(backendURL + "/api/user/" + $scope.userID + "/comment", $scope.comment)
                .success(function(data, status, headers, config){
                    $scope.comment.body = "";
                    //TODO signal success
                })
                .error(function(data, status, headers, config){
                    //TODO signal error
                });
        };


    });
