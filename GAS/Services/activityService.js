(function () {
    'use strict';

    angular
        .module('gas')
        .factory('activityService', activityService);
    activityService.$inject = ['$http', '$filter', '$rootScope'];

    function activityService($http, $filter, $rootScope) {
        var service = {};

        service.GetAll = GetAll;
        service.GetSummary = GetSummary;
        service.GetDashboardData = GetDashboardData;
        service.GetByActivityID = GetByActivityID;
        service.GetActivitiesByApprover = GetActivitiesByApprover;
        service.GetActivitiesByEmployee = GetActivitiesByEmployee;
        service.GetActivitiesByProject = GetActivitiesByProject;
        service.CreateActivity = CreateActivity;
        //service.CreateQuickExpense = CreateQuickExpense;
        service.AddExpenseItem = AddExpenseItem;
        return service;

        function GetAll(Status) {
            var url = $rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + "/Status/" + Status;
         
            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + "/Status/" + Status)
                .then(handleSuccess, handleError('Error getting all users'));
        }

        function GetSummary() {

            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + '/Summary')
                .then(handleSuccess, handleError('Error getting all users'));
        }

        function GetDashboardData(id) {

            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + '/Dashboard/Employee/' + id)
                .then(returndata, handleError('Error getting all users'));
        }

        function GetByActivityID(id) {
            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + "/Activity/" + id)
                .then(returndata, handleError('Error getting user by id'));
        }

        function GetActivitiesByApprover(id, Status) {

            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + "/Approver/" + id + "/Status/" + Status)
                .then(handleSuccess, handleError('Error getting all users'));
        }
        function GetActivitiesByProject(id, status) {

            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + "/Project/" + id+"/Status/"+ status)
                .then(handleSuccess, handleError('Error getting all users'));
        }
        //function GetActivitiesByApprover(id) {

           
        //    var data = { Employeeid: id, OrgID: $rootScope.OrgID };
        //    var jsonData = angular.toJson(data);
        //    return $http({
        //        url: $rootScope.AbsUrl + 'api/Activity/ByApprover',
        //        method: "Get",
        //        data: data,
        //        headers: {
        //            'Content-Type': 'application/Json; charset=UTF-8'
        //        }
        //    }).then(handleSuccess, handleError('Error getting all users'));
        //}



        function GetActivitiesByEmployee(id, status) {
            return $http.get($rootScope.APIUrl + 'api/Activity/Organization/' + $rootScope.OrgID + '/Employee/' + id + '/Status/' + status)
                .then(returndata, handleError('Error getting all users'));
        }

        //function GetActivitiesByEmployee(id) {
        //    var data = { Employeeid: id, OrgID: $rootScope.OrgID };
        //    var jsonData = angular.toJson(data);
        //    return $http({
        //        url: $rootScope.AbsUrl + 'api/Activity/ByEmployee',
        //        method: "POST",
        //        data: jsonData,
        //        headers: {
        //            'Content-Type': 'application/Json; charset=UTF-8'
        //        }
        //    }).then(function (res) {

        //        return res;

        //    });
        //}


        function AddExpenseItem(activity) {
            var jsonData = angular.toJson(activity);
            return $http({
                url: $rootScope.APIUrl + 'api/Activity/AddItem',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });

        }


        function CreateActivity(activity)
        {
            var jsonData = angular.toJson(activity);
            return $http({
                url: $rootScope.APIUrl + 'api/Activity/CreateActivity',
                method: "POST",
                data: jsonData,
                headers: {
                    'Content-Type': 'application/Json; charset=UTF-8'
                }
            }).then(function (res) {

                return res;

            });

        }

    

        //function CreateQuickExpense(activity) {
        //    var jsonData = angular.toJson(activity);
        //    return $http({
        //        url: 'http://localhost:23699/api/Activity/CreateQuick',
        //        method: "POST",
        //        data: jsonData,
        //        headers: {
        //            'Content-Type': 'application/Json; charset=UTF-8'
        //        }
        //    }).then(function (res) {

        //        return res;

        //    });

        //}


        function returndata(res) {
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