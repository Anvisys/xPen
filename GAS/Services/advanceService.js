(function () {
    'use strict';

    angular
        .module('gas')
        .factory('advanceService', advanceService);
    advanceService.$inject = ['$http', '$filter', '$rootScope'];

    function advanceService($http, $filter, $rootScope) {

        var service = {};
        service.getAll = getAll;
        service.getAdvanceForActivity = getAdvanceForActivity;
        service.getAdvanceForApprover = getAdvanceForApprover;
        service.addItem = addItem;
        return service;

        function getAll(status) {
            return $http.get($rootScope.APIUrl + 'api/Advance/Organization/' + $rootScope.OrgID + "/Status/" + status)
             .then(handleSuccess, handleError('Error getting AdvanceList'));
            //return AccList;
        }

        function getAdvanceForActivity(id) {
            return $http.get($rootScope.APIUrl + 'api/Advance/Organization/' + $rootScope.OrgID + '/Activity/' + id)
             .then(handleSuccess, handleError('Error getting AdvanceList'));
            //return AccList;
        }

        function getAdvanceForApprover(id, status) {
            return $http.get($rootScope.APIUrl + 'api/Advance/Organization/' + $rootScope.OrgID + '/Approver/' + id + "/Status/" + status)
             .then(handleSuccess, handleError('Error getting AdvanceList'));
            //return AccList;
        }

        function addItem(item) {
            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/Advance/Add',
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