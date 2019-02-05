(function () {
    'use strict';

    angular
        .module('gas')
        .factory('invoiceService', invoiceService);
    invoiceService.$inject = ['$http', '$rootScope'];

    function invoiceService($http, $rootScope) {

        var service = {};
        service.getSellForProject = getSellForProject;
        service.getUnpaidSell = getUnpaidSell;
        service.getPurchaseForProject = getPurchaseForProject;
        service.addSellInvoice = addSellInvoice;
        service.receivePayment = receivePayment;
        service.addPurchaseInvoice = addPurchaseInvoice;
        service.makePayment = makePayment;
        service.getSell = getSell;
        service.getPurchase = getPurchase;
        return service;

        function getSellForProject(PrjId) {
            return $http.get($rootScope.APIUrl + 'api/Invoice/Sell/Organization/' + $rootScope.OrgID + "/Project/" + PrjId)
             .then(handleSuccess, handleError('Error getting Invoices'));
        }

        function getUnpaidSell() {
        
            return $http.get($rootScope.APIUrl + 'api/Invoice/Sell/Organization/' + $rootScope.OrgID + "/Unpaid")
             .then(handleSuccess, handleError('Error getting Invoices'));
        }

        function getPurchaseForProject(PrjId) {
            return $http.get($rootScope.APIUrl + 'api/Invoice/Purchase/Organization/' + $rootScope.OrgID + "/Project/" + PrjId)
             .then(handleSuccess, handleError('Error getting Invoices'));
        }

        function getSell(year, month) {
            return $http.get($rootScope.APIUrl + 'api/Invoice/Sell/Organization/' + $rootScope.OrgID + "/" + year + "/" + month)
             .then(handleSuccess, handleError('Error getting Invoices'));
        }
        function getPurchase(year,month) {
            return $http.get($rootScope.APIUrl + 'api/Invoice/Purchase/Organization/' + $rootScope.OrgID + "/" + year + "/" + month)
             .then(handleSuccess, handleError('Error getting Invoices'));
        }
       

        function addSellInvoice(inv) {

            var jsonData = angular.toJson(inv);

            return $http({
                url: $rootScope.APIUrl + 'api/Invoice/SellInvoice',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }

        function receivePayment(payment) {

            var jsonData = angular.toJson(payment);

            return $http({
                url: $rootScope.APIUrl + 'api/Invoice/ReceivePayment',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }


        function makePayment(payment) {

            var jsonData = angular.toJson(payment);

            return $http({
                url: $rootScope.APIUrl + 'api/Invoice/GivePayment',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });


        }


        function addPurchaseInvoice(inv) {

            var jsonData = angular.toJson(inv);

            return $http({
                url: $rootScope.APIUrl + 'api/Invoice/PurchaseInvoice',
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
            return res.data.$values;
        }

        function handleError(error) {

            return function () {
                return { success: false, message: error };
            };
        }
    }
}());