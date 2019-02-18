(function () {
    'use strict';

    angular
        .module('gas')
        .factory('dailyExpenseService', dailyExpenseService);
    dailyExpenseService.$inject = ['$http', '$filter', '$rootScope'];

    function dailyExpenseService($http, $filter, $rootScope) {
        var service = {};

        service.getDailyExpenseForOrganizaion = getDailyExpenseForOrganizaion;
        service.getDailyExpenseForProject = getDailyExpenseForProject;
        service.getDailyExpenseForManager = getDailyExpenseForManager;
        service.getDailyExpenseForEmployee = getDailyExpenseForEmployee;
        return service;

        function getDailyExpenseForOrganizaion() {
            return $http.get($rootScope.APIUrl + '/api/DailyExpense/Organization/' + $rootScope.OrgID )
                .then(handleSuccess, handleError('Error getting DailyExpense'));
        }

        function getDailyExpenseForProject(PrjId) {
            return $http.get($rootScope.APIUrl + '/api/DailyExpense/Project/' + PrjId)
                .then(handleSuccess, handleError('Error getting DailyExpense'));
        }

        function getDailyExpenseForManager(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/DailyExpense/' + $rootScope.OrgID + '/Manager/' + EmpID)
                .then(handleSuccess, handleError('Error getting DailyExpense'));
        }

        function getDailyExpenseForEmployee(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/DailyExpense/' + $rootScope.OrgID + '/Employee/' + EmpID)
                .then(handleSuccess, handleError('Error getting DailyExpense'));
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
}
    ());