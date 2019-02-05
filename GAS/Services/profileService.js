(function () {
    'use strict';

    angular
        .module('gas')
        .factory('profileService', userService);
    userService.$inject = ['$http', '$rootScope'];

    function userService($http, $rootScope) {
        var service = {};
        service.GetImage = GetImage;
        service.addImage = addImage;
        service.GetByMobile = GetByMobile;
        service.ChangePassword = ChangePassword;
        return service;

        function GetImage(id) {
            // alert(id);
            return $http.get($rootScope.APIUrl + 'api/Image/' + id)
                .then(returndata, handleError('Error getting all users'));
        }

        function GetByMobile(mobile) {
            return $http.get($rootScope.APIUrl + 'api/User/Mobile/' + mobile)
                .then(returndata, handleError('Error getting user for Mobile'));
        }

        function ChangePassword(userId,pwd) {
            return $http.get($rootScope.APIUrl + 'api/User/Change/UserID/' + userId + "/lock/" + pwd)
                .then(returndata, handleError('Error getting user for Mobile'));
        }
     
        function addImage(item) {

            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/Image',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }

      

        function returndata(res) {
            return res.data;
        }


        // private functions

        function handleSuccess(res) {
            return res.data.$values;
        }

        function handleError(error) {

            return function () {
                return { success: false, message: error };
            };
        }

    }

}());