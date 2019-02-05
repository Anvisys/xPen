(function () {
    'use strict';

    angular
        .module('gas')
        .factory('projectService', projectService);
    projectService.$inject = ['$http', '$rootScope'];

    function projectService($http, $rootScope) {

        var service = {};
        service.getAllProject = getAllProject;
        service.getProjectData = getProjectData;
        service.getProjectForManager = getProjectForManager;
        service.getDailyExpense = getDailyExpense;
        service.addProject = addProject;
        service.UpdateStatus = UpdateStatus;
        return service;

        function getAllProject(status) {
            return $http.get($rootScope.APIUrl + 'api/Project/Organization/' + $rootScope.OrgID + "/Status/" + status)
             .then(handleSuccess, handleError('Error getting Accounts'));
            
        }

        function getProjectData(PrjId) {
            return $http.get($rootScope.APIUrl + 'api/Project/Organization/' + $rootScope.OrgID + "/Project/" + PrjId)
             .then(handleSuccess, handleError('Error getting Accounts'));

        }
        function getDailyExpense(PrjId) {
            return $http.get($rootScope.APIUrl + 'api/DailyExpense/Project/'  + PrjId)
             .then(returnData, handleError('Error getting Accounts'));
        }


        function getProjectForManager(id, status) {
            return $http.get($rootScope.APIUrl + 'api/Project/Organization/' + $rootScope.OrgID + "/Manager/" + id + "/Status/" + status)
            .then(handleSuccess, handleError('Error getting Accounts'));

        }

      
        function addProject(prj) {

            var jsonData = angular.toJson(prj);
           
         return   $http({
             url: $rootScope.APIUrl + 'api/Project/New',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
            });

           
        }

        function UpdateStatus(prj) {

            var jsonData = angular.toJson(prj);

            return $http({
                url: $rootScope.APIUrl + 'api/Project/Update',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (response) {

                return response;
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