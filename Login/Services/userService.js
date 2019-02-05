(function () {
    'use strict';

    angular
        .module('login')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$filter', '$rootScope'];
    function UserService($http, $filter, $rootScope) {
        var service = {};
       
        service.GetAll = GetAll;
        service.GetValidUser = GetValidUser;
        service.addUser = addUser;
        service.IfExist = IfExist;
        return service;

        function GetAll() {
           
            return $http.get($rootScope.APIUrl+'api/users/').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get($rootScope.APIUrl+'api/users/ByOrg/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetUser(username) {
            return $http.get($rootScope.APIUrl+'api/user/ValidateUser' + username).then(handleSuccess, handleError('Error getting user by username'));
        }



        function GetValidUser(data) {
            var jsonData = angular.toJson(data);
         
            return $http({
                url: $rootScope.APIUrl+'api/User/Validate',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {
                //alert($filter("json")(res));
                return res;

            });

        }

        function addUser(item) {

            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl +'api/user/AddUser',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }

        function IfExist(email, mobile) {
           var data = {UserEmail:email,UserMobile: mobile};
            var jsonData = angular.toJson(data);

            return $http({
                url: $rootScope.APIUrl+ 'api/user/IfExist',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });
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

})();
