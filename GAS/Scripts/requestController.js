(function () {
    'use strict';
    var app = angular.module('gas');

    app.controller('requestCtrl', function ($scope, userService, $timeout) {
        $scope.approvalForm = false;
        $scope.NewAdminForm = false;
        $scope.newAdmin_progress = false;
        $scope.newOrg_progress = false;
        $scope.request_approval = false;
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";

        $scope.ShowApprove = function (org)
        {
            $scope.SelectedOrg = org;
            //$scope.approvalForm = true;
            $scope.adminName = org.ContactPerson;
            $scope.adminEmail = org.ContactEmail;
            $scope.adminMobile = org.ContactNumber;
            $scope.adminRole = "Admin";
            $scope.NewAdminForm = true;

        }

        $scope.Cancel = function () {
            $scope.approvalForm = false;
        }

        $scope.AddOrganization = function ()
        {
           $scope.newOrg_progress = true;
                var OrgData = {
                    OrganizationName: $scope.OrgName, Employee: $scope.EmployeeCount, Address: $scope.OrgAddress,
                    ContactPerson: $scope.ContactPerson, ContactNumber: $scope.ContactMobile,
                    ContactEmail: $scope.ContactEmail, Status: "Submitted"
                };

            userService.RegisterOrg(OrgData)
                .then(function (res) {
                    $scope.newOrg_progress = false;
                    if (res.data.Response == "OK") {
                        $scope.response = "Organization Added";
                        $scope.NewOrganizationForm = false;
                        GetRequests()
                    }
                    else {
                        $scope.response = "Error Submitting Request, Try again.";
                    }


                });
           
        }


        $scope.ApproveSubmit = function () {
           $scope.request_approval = true;
            $scope.SelectedOrg.OrganizationNumber = $scope.orgNumber;
            $scope.SelectedOrg.Status = 'Approved';
            userService.UpdateOrg($scope.SelectedOrg)
            .then(function (res) {
                $scope.request_approval = false;
                if (res.data.Response == "OK")
                {
                   // alert("addingUser");
                    CreateUser();
                }
                else {
                   
                    $scope.response = "Error Updating try later";
                }

            });

        }

        $scope.AddAdmin = function()
        {
           $scope.newAdmin_progress = true;
                var userData = {
                    UserLogin: $scope.adminEmail, OrganizationID: $scope.SelectedOrg.OrganizationID, OrgName: $scope.SelectedOrg.OrganizationName, Password: "Password@123",
                    Role: "Admin", UserName: $scope.adminName, UserEmail: $scope.adminEmail, UserMobile: $scope.adminMobile, Status: "Active", SolutionType:"Web"
                };
                //alert(JSON.stringify(userData));

            userService.addUser(userData)
                    .then(function (res) {
                        //alert(JSON.stringify(res));
                        $scope.newAdmin_progress = false;
                        if (res.Response == "OK") {
                            GetRequests();
                            $scope.NewAdminForm = false;
                        }
                        else if (res.Response == "Fail") {
                            $scope.response ="Failed to Update";
                        }
                        else if (res.Response == "Invalid") {
                            if (res.IsMail == "False")
                            {
                                //alert(1);
                               $scope.response = "Email is already used";
                            }
                            if (res.IsMobile == "False")
                            { $scope.response = "Mobile is already used"; }
                        }
                    });

        
        }


        $timeout(function () {
            GetRequests();
        }, 10);

        function GetRequests() {

            userService.GetAllOrganization()
            .then(function (data) {
               
               $scope.OrgnizationList = data;

            });
        }

    });

}());