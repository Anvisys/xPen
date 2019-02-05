(function () {
    'use strict';

    angular
        .module('login')
        .factory('registerService', registerService);

    registerService.$inject = ['$http', '$filter', '$rootScope'];
    function registerService($http, $filter, $rootScope) {
        var service = {};

        service.GetAll = GetAll;
        service.Register = Register;
        service.Update = Update;
        return service;

        function GetAll() {
            alert($rootScope.APIUrl);
            return $http.get($rootScope.APIUrl +'api/Organization').then(handleSuccess, handleError('Error getting all users'));
        }

    


        function Register(data) {
     
            var jsonData = angular.toJson(data);

            return $http({
                url: $rootScope.APIUrl+'api/Organization/New',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });

        }


        function Update(data) {
   
            var jsonData = angular.toJson(data);

            return $http({
                url: $rootScope.APIUrl+'api/Organization/Update',
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