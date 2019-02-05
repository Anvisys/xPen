(function () {
    'use strict';

    angular
        .module('gas')
        .factory('expenseService', expenseService);
    expenseService.$inject = ['$http', '$filter', '$rootScope'];

    function expenseService($http, $filter, $rootScope) {

        var service = {};
        service.getExpenseList = getExpenseList;
        service.addExpense = addExpense;
        service.getExpenseDataForMonth = getExpenseDataForMonth;
        service.getExpenseDataForYear = getExpenseDataForYear;
 
        return service;

        function getExpenseList(id) {
            return $http.get($rootScope.APIUrl + '/api/Expense/' + id)
             .then(handleSuccess, handleError('Error getting Accounts'));
            //return AccList;
        }
        function getExpenseDataForMonth(id, year, month)
        {
            return $http.get($rootScope.APIUrl + '/api/Expense/' + id + "/Year/" + year + "/Month/" + month)
            .then(handleSuccess, handleError('Error getting Accounts'));
        }

        function getExpenseDataForYear()
        {
            return $http.get($rootScope.APIUrl + '/api/Expense/' + id + "/Year/" + year)
            .then(handleSuccess, handleError('Error getting Accounts'));

        }

      


        function addExpense(item) {
            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + '/api/Expense',
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