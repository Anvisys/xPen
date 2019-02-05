(function () {
    'use strict';

    angular
        .module('gas')
        .factory('accountService', accountService);
    accountService.$inject = ['$http', '$filter', '$rootScope'];

    function accountService($http, $filter, $rootScope) {

        var service = {};
        service.getAccountList = getAccountList;
        service.addAccount = addAccount;
        service.getAccountListByOrg = getAccountListByOrg;
        return service;

        function getAccountList() {
            return $http.get($rootScope.APIUrl + 'api/Account/Organization/' + $rootScope.OrgID)
             .then(handleSuccess, handleError('Error getting Accounts'));
            //return AccList;
        }

        function getAccountListByOrg(id) {
            return $http.get($rootScope.APIUrl + 'api/Account/Organization/' + $rootScope.OrgID)
             .then(handleSuccess, handleError('Error getting Accounts'));
            //return AccList;
        }
        function addAccount(item) {
            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/Account/NewAccount',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });
        }

        function handleSuccess(res) {
            //alert($filter("json")(res.data.$values));
            return res.data.$values;
        }

        function handleError(error) {

            return function () {
                return { success: false, message: error };
            };
        }

    }

}());