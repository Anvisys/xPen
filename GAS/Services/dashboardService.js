(function () {
    'use strict';

    angular
        .module('gas')
        .factory('dashboardService', dashboardService);
    dashboardService.$inject = ['$http', '$filter', '$rootScope'];

    function dashboardService($http, $filter, $rootScope) {
        var service = {};

        service.getExpenseByEmpStatus = getExpenseByEmpStatus;
        service.getExpenseByManagerStatus = getExpenseByManagerStatus;
        service.getActiveProjects = getActiveProjects;
        service.getTodayExpense = getTodayExpense;
        service.getTodayExpenseForManager = getTodayExpenseForManager;
        service.getIPSalesForManager = getIPSalesForManager;
        service.getIPPurchaseForManager = getIPPurchaseForManager;
        return service;

        function getExpenseByEmpStatus(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/Dashboard/UnpaidExpense/' + $rootScope.OrgID + '/Employee/' + EmpID)
                .then(handleSuccess, handleError('Error getting Accounts'));
        }

        function getExpenseByManagerStatus(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/Dashboard/UnpaidExpense/' + $rootScope.OrgID + '/Manager/' + EmpID)
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

        function getTodayExpenseForManager(EmpID) {
            return $http.get($rootScope.APIUrl + '/api/dashboard/TodayExpense/' + $rootScope.OrgID + '/Manager/' + EmpID)
                .then(handleSuccess, handleError('Error getting Accounts'));
        }


        function getIPSalesForManager(EmpID, Margin) {
            return $http.get($rootScope.APIUrl + '/api/dashboard/IPSalesInvoice/' + $rootScope.OrgID + '/Employee/' + EmpID + "/" + Margin)
                .then(handleSuccess, handleError('Error getting SalesData'));
        }

        function getIPPurchaseForManager(EmpID, Margin) {
            return $http.get($rootScope.APIUrl + '/api/dashboard/IPPurchaseInvoice/' + $rootScope.OrgID + '/Employee/' + EmpID + "/" + Margin)
                .then(handleSuccess, handleError('Error getting PurchaseData'));
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