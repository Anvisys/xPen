(function () {
    'use strict';

    angular
        .module('gas')
        .factory('orgService', orgService);
    orgService.$inject = ['$http', '$rootScope'];

    function orgService($http, $rootScope) {
        var service = {};
        service.GetAll = GetAll;
        return service;

        function GetAll() {
                return $http.get($rootScope.APIUrl + 'api/Organization')
                    .then(handleSuccess, handleError('Error getting all users'));
        }

        
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