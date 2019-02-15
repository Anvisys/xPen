(function () {
    'use strict';

    angular
        .module('gas')
        .factory('dashboardService', dashboardService);
    dashboardService.$inject = ['$http', '$filter', '$rootScope'];

    function dashboardService($http, $filter, $rootScope) {
        var service = {};

        service.getExpenseByEmpStatus = getExpenseByEmpStatus;
        service.getActiveProjects = getActiveProjects;
        service.getTodayExpense = getTodayExpense;
        return service;

        function getExpenseByEmpStatus(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/Dashboard/UnpaidExpense/' + $rootScope.OrgID + '/Employee/' + EmpID)
                .then(handleSuccess, handleError('Error getting Accounts'));
        }

        function getActiveProjects(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/Dashboard/Running/' + $rootScope.OrgID + '/Employee/' + EmpID)
                .then(handleSuccess, handleError('Error getting Accounts'));
        }

        function getTodayExpense(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/dashboard/TodayExpense/' + $rootScope.OrgID + '/Employee/' + EmpID)
                .then(handleSuccess, handleError('Error getting Accounts'));
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