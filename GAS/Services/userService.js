(function () {
    'use strict';

    angular
        .module('gas')
        .factory('userService', userService);
    userService.$inject = ['$http', '$rootScope'];

    function userService($http, $rootScope) {
        var service = {};
        service.GetAll = GetAll;
        service.GetAllForOrganization = GetAllForOrganization;
        service.GetUserByID = GetUserByID;
        service.addUser = addUser;
        service.addExistingUser = addExistingUser;
        service.ForgotPassword = ForgotPassword;
        service.UpdateOrg = UpdateOrg;
        service.RegisterOrg = RegisterOrg;
        service.GetAllOrganization = GetAllOrganization;
        service.GetDailyExpense = GetDailyExpense;
        service.GetByMobile = GetByMobile;
        service.GetByFilter = GetByFilter;
        return service;

        function GetAll() {
            // alert(id);
            return $http.get($rootScope.APIUrl + 'api/User/All')
                .then(handleSuccess, handleError('Error getting all users'));
        }

        function GetAllForOrganization() {
            // alert(id);
            return $http.get($rootScope.APIUrl + 'api/User/Organization/' + $rootScope.OrgID)
                .then(handleSuccess, handleError('Error getting all users'));
        }

        function GetAllForOrganization() {
           // alert(id);
            return $http.get($rootScope.APIUrl + 'api/User/Organization/' + $rootScope.OrgID)
                .then(handleSuccess, handleError('Error getting all users'));
        }

        function GetUserByID(id) {
            
            return $http.get($rootScope.APIUrl + 'api/User/UserID/' + id)
                           .then(returndata, handleError('Error getting user for Mobile'));
        }

        function GetByMobile(mobile)
        {
            return $http.get($rootScope.APIUrl + 'api/User/Mobile/' + mobile)
                .then(returndata, handleError('Error getting user for Mobile'));
        }

        function GetByFilter(filter) {
            return $http.get($rootScope.APIUrl + 'api/User/Filter/' + filter)
                .then(returndata, handleError('Error getting user for Mobile'));
        }

        function GetDailyExpense(id)
        {
            return $http.get($rootScope.APIUrl + 'api/DailyExpense/' + $rootScope.OrgID +'/Employee/' + id)
               .then(returndata, handleError('Error getting all users'));

        }

        function addUser(item) {

            var jsonData = angular.toJson(item);
           
            return $http({
                url: $rootScope.APIUrl + 'api/user/AddUser',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response.data;
            });


        }

        function addExistingUser(item) {

            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/user/Existing',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }

        function ForgotPassword(email,mobile)
        {
            return $http.get($rootScope.APIUrl + 'api/UserForgot/Email/' + email + "/Mobile/" + mobile)
                .then(returndata, handleError('Error getting user for Mobile'));
        }

        function UpdateOrg(data) {

            var jsonData = angular.toJson(data);

            return $http({
                url: $rootScope.APIUrl + 'api/Organization/Update',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });

        }

        function RegisterOrg(data) {

            var jsonData = angular.toJson(data);

            return $http({
                url: $rootScope.APIUrl + 'api/Organization/New',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });

        }

        function GetAllOrganization() {
          
            return $http.get($rootScope.APIUrl + 'api/Organization').then(handleSuccess, handleError('Error getting all users'));
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