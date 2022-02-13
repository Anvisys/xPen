(function () {

    var app = angular.module("gas");
    app.controller("organizationdCtrl", function (orgService, $timeout, $scope, $rootScope, $cookies) {
        $scope.chartColors = ["#db3e49", "#0e1cd2", "#0ed2c4"];
        $scope.roles = ["Admin", "Manager", "Employee"];
        $scope.user_role = "Employee";
        $scope.userList = [];
        $scope.newUserDiv = false;
        $scope.newUser_progress = false;
        $scope.prefix = 'UserImage_';
        $scope.UserImages = {};
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";

        $scope.NewUser = function () {
            $scope.newUserDiv = true;
        }

        $scope.Close = function () {
            $scope.newUserDiv = false;
        }


        $scope.ShowDetail = function (user) {


        }

        $scope.ToggleFilter = function () {

            $scope.ShowFilter = !$scope.ShowFilter;
        }


        $scope.Remove = function (user) {
            $scope.SelectedUser = user;
            $scope.ConfirmRemoval = true;
        }

        $scope.UserRemove = function () {
            $scope.SelectedUser.OrganizationID = 0;
            $scope.SelectedUser.OrgName = 'Individual';
            $scope.SelectedUser.Role = 'Individual';
            $scope.SelectedUser.SolutionType = 'Individual';

            userService.addExistingUser($scope.SelectedUser)
                .then(function (data) {
                    if (data.data.Response === "OK") {
                        GetUserData();
                        $scope.existingUserDiv = false;
                    }
                    else if (data.data.Response === "Fail") {
                        alert("Failed to Update");
                    }
                });
        }

        $scope.UserAdd = function () {
            $scope.newUser_progress = true;
            var userData = {
                UserLogin: $scope.user_email, OrganizationID: $rootScope.OrgID, OrgName: $rootScope.OrgName, Password: $scope.user_password,
                Role: $scope.user_role, UserName: $scope.user_name, UserEmail: $scope.user_email, UserMobile: $scope.user_mobile,
                Status: "Active", SolutionType: $rootScope.SolutionType
            };


            userService.addUser(userData)
                .then(function (data) {

                    $scope.newUser_progress = false;
                    if (data.Response === "OK") {
                        GetUserData();
                        $scope.newUserDiv = false;
                    }
                    else if (data.Response === "Invalid") {

                        $scope.response = "!Invalid Data";
                    }
                    else if (data.Response === "Fail") {

                        $scope.response = "!Failed to Update";
                    }
                });

        };

        $scope.AddExistingUser = function () {
            $scope.SelectedUser.OrganizationID = $rootScope.OrgID;
            $scope.SelectedUser.OrgName = $rootScope.OrgName;
            $scope.SelectedUser.Role = 'Employee';
            $scope.SelectedUser.SolutionType = 'Web';

            userService.addExistingUser($scope.SelectedUser)
                .then(function (data) {
                    if (data.data.Response === "OK") {
                        GetUserData();
                        $scope.existingUserDiv = false;
                    }
                    else if (data.data.Response === "Fail") {
                        alert("Failed to Update");
                    }
                });
        }

        $scope.GetUser = function () {
            userService.GetByMobile($scope.SearchMobile)
                .then(function (data) {
                    console.log(JSON.stringify(data));

                    if (data == null) {
                        $scope.UserText = "No User matching Mobile.";
                    }
                    else if (data.OrgId == $rootScope.OrgID) {

                        $scope.UserText = "User " + data.UserName + "(" + data.UserMobile + ") already added in organization.";
                    }
                    else if (data.OrgId != 0) {
                        $scope.UserText = "User " + data.UserName + "(" + data.UserMobile + ") is part of some organization;";

                    }
                    else if (data.OrgId == 0) {

                        // $scope.UserName = data.UserName + " " + data.UserMobile + " " + data.UserEmail;
                        $scope.UserText = "User Name :" + data.UserName + "(" + data.UserMobile + "), Email : " + data.UserEmail
                            + ";";
                        $scope.SelectedUser = data;

                    }

                });
        }


        $scope.Show = function (user) {
            GetEmployeeActivitiesData(user.UserId);
            GetEmployeeExpenseData(user.UserId);
            $scope.selectedUser = user.UserName;
        }

        $timeout(function () {
            GetOrganizationData();
        }, 10);

        function GetOrganizationData() {
            orgService.GetAll()
                .then(function (data) {
                    $scope.orgList = data;
                });
        }


    });

})();