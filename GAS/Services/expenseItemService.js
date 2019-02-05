(function () {
    'use strict';

    angular
        .module('gas')
        .factory('expenseItemService', expenseItemService);

    expenseItemService.$inject = ['$http', '$rootScope'];

    function expenseItemService($http, $rootScope) {
       
        var service = {};

        service.getExpenseDataForActivity = getExpenseDataForActivity;
        service.addItem = addItem;
        service.deleteItem = deleteItem;
        service.getExpenseData = getExpenseData;
        service.getExpenseDataForProject = getExpenseDataForProject;
        service.getExpenseDataForEmployee = getExpenseDataForEmployee;
        service.getDailyOrganizationExpense = getDailyOrganizationExpense;
        service.addPayment = addPayment
        return service;

        function addItem(item) {

           // var jsonData = angular.toJson(item);
            var url = $rootScope.APIUrl + 'api/ExpenseItem/Add';
               

            return $http({
                url: $rootScope.APIUrl + 'api/ExpenseItem/Add',
                method: "POST",
                data: item,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
                }, function (err) {
                   alert(err)
                });


        }

        function addPayment(payment) {
            
            //var jsonData = angular.toJson(payment);

            return $http({
                url: $rootScope.APIUrl + 'api/ExpenseItem/AddItem',
                method: "POST",
                data: payment,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });
        }

        function deleteItem(item) {

            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/ExpenseItem/Delete',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }

        

        function getExpenseData(id) {
            return $http.get($rootScope.APIUrl + '/api/ExpenseItem/Organization/' + $rootScope.OrgID)
            .then(returnData, handleError('Error getting Accounts'));
        }

        function getExpenseDataForProject(id) {
            return $http.get($rootScope.APIUrl + '/api/ExpenseItem/Project/' + id)
            .then(returnData, handleError('Error getting Accounts'));
        }

        function getExpenseDataForEmployee(id) {
            return $http.get($rootScope.APIUrl + '/api/ExpenseItem/Employee/' + id)
            .then(returnData, handleError('Error getting Accounts'));
        }

        function getDailyOrganizationExpense()
        {
            return $http.get($rootScope.APIUrl + '/api/DailyExpense/Organization/' + $rootScope.OrgID)
           .then(returnData, handleError('Error getting Accounts'));
        }

        function getExpenseDataForActivity(id) {
           
            return $http.get($rootScope.APIUrl + 'api/ExpenseItem/Activity/' + id)
             .then(handleSuccess, handleError('Error getting Accounts'));
            //return AccList;
        }

        function returnData(res) {
            return res.data;
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