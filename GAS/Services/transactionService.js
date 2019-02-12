(function () {
    'use strict';

    angular
        .module('gas')
        .factory('transactionService', transactionService);
    transactionService.$inject = ['$http', '$rootScope'];

    function transactionService($http, $rootScope) {

        var service = {};
        service.GetPage = GetPage;
        service.GetForProject = GetForProject;
        service.Transfer = Transfer;
        service.AddPayment = AddPayment;
        service.AddTransactions = AddTransactions;
        service.getDailyTransaction = getDailyTransaction;
        service.getDailyAccountTransaction = getDailyAccountTransaction;
        service.getByMonth = getByMonth;
        service.getTaxPaid = getTaxPaid;
        service.getTransactionByDate = getTransactionByDate;
        service.getForUserByMonth = getForUserByMonth;
        return service;

        function GetPage(id) {
            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/Page/' + id)
                .then(handleSuccess, handleError('Error getting user by username'));
        }

        function GetForProject(PrjID) {
            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/' + PrjID)
                .then(handleSuccess, handleError('Error getting user by transaction'));
        }

        function getDailyTransaction() {
            
            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/Day')
                .then(returnData, handleError('Error getting daily transaction'));
        }

        function getTransactionByDate(date)
        {
            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/Date/' + date)
               .then(returnData, handleError('Error getting transaction by date'));

        }

        function getDailyAccountTransaction(AccID) {

            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/Day/Account/' + AccID)
                .then(returnData, handleError('Error getting account Transaction'));
        }

        function getByMonth(year, month)
        {
            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/Year/' + year + '/Month/' + month)
               .then(handleSuccess, handleError('Error getting transaction'));
        }

        function getForUserByMonth(UserID,year, month) {
            return $http.get($rootScope.APIUrl + 'api/Transaction/Organization/' + $rootScope.OrgID + '/User/' + UserID + '/Year/' + year + '/Month/' + month)
               .then(handleSuccess, handleError('Error getting transaction'));
        }

        function getTaxPaid(year, month) {
            return $http.get($rootScope.APIUrl + 'api/Transaction/Tax/Organization/' + $rootScope.OrgID + '/Year/' + year + '/Month/' + month)
               .then(handleSuccess, handleError('Error getting tax'));
        }

        function Transfer(transaction) {

            var jsonData = angular.toJson(transaction);

            return $http({
                url: $rootScope.APIUrl + 'api/transaction/Transfer',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });

        }

        function AddPayment(transaction)
        {
            var jsonData = angular.toJson(transaction);

            return $http({
                url: $rootScope.APIUrl + 'api/transaction/Payment',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });


        }

        function AddTransactions(transactions) {
            console.log(transactions);
            var jsonData = angular.toJson(transactions);

            return $http({
                url: $rootScope.APIUrl + 'api/transaction/Payment',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });


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