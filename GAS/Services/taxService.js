(function () {
    'use strict';

    angular
        .module('gas')
        .factory('taxService', taxService);
    taxService.$inject = ['$http', '$rootScope'];

    function taxService($http, $rootScope) {
        var service = {};
        service.GetLastGST = GetLastGST;
        service.GetLastTDS = GetLastTDS;
        service.GetGST = GetGST;
        service.GetTDS = GetTDS;
        service.baselineTDS = baselineTDS;
        service.baselineGST = baselineGST;
        return service;

        function GetLastGST() {
              return $http.get($rootScope.APIUrl + 'api/Tax/GST/' + $rootScope.OrgID)
                .then(returndata, handleError('Error getting GST'));
        }

        function GetLastTDS() {
            return $http.get($rootScope.APIUrl + 'api/Tax/TDS/' + $rootScope.OrgID)
                .then(returndata, handleError('Error getting TDS'));
        }

        function GetGST(year, month) {
            return $http.get($rootScope.APIUrl + 'api/Tax/GST/' + $rootScope.OrgID + "/" + year + "/" + month)
              .then(returndata, handleError('Error getting GST for Month'));
        }

        function GetTDS(year, month) {
            return $http.get($rootScope.APIUrl + 'api/Tax/TDS/' + $rootScope.OrgID + "/" + year + "/" + month)
                .then(returndata, handleError('Error getting TDS for month'));
        }

        function baselineTDS(item) {
          
            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/Tax/TDSBaseline',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response.data;
            });


        }

        function baselineGST(item) {

            var jsonData = angular.toJson(item);

            return $http({
                url: $rootScope.APIUrl + 'api/Tax/GSTBaseline',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response.data;
            });


        }



        function returndata(res) {
            return res.data;
        }


        // private functions

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