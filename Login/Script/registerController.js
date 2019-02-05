(function () {
    var app = angular.module('login');

    app.controller('registerCtrl', function ($scope, registerService, UserService) {

        $scope.AccountType = ["Individual","WebIndustrial","Enterprise"];
        $scope.ValidUser = false;
        $scope.SelAccountType = $scope.AccountType[0];
        $scope.progress = false;
        $scope.CheckIfAvailable = function()
        {
            UserService.IfExist($scope.ContactEmail,$scope.ContactMobile)
            .then(function (res) {
                alert(JSON.stringify(res));
                if (res.data.Response == "OK")
                {

                    if (res.data.IsMail == "False" )
                    {
                        $scope.ValidUser = false;
                    }
                    if(res.data.IsMobile == "False")
                    {
                        $scope.ValidUser = false;
                    }
                    if(res.data.IsMail == "True"&& res.data.IsMobile == "True")
                    {
                        alert('valid');
                        $scope.ValidUser = true;
                    }

                }
                else
                { alert("Try Again");  }
            });
            
        }

        $scope.Register = function () {
            $scope.progress = true;
            if ($scope.SelAccountType == "WebIndustrial" || $scope.SelAccountType == "Enterprise") {
                var OrgData = { OrganizationName: $scope.OrgName, Employee: $scope.EmployeeCount, Address: $scope.OrgAddress, ContactPerson: $scope.ContactPerson, ContactNumber: $scope.ContactMobile, ContactEmail: $scope.ContactEmail, Status: "Submitted" };

                registerService.Register(OrgData)
                .then(function (res) {
                    $scope.progress = false;
                    if (res.data.Response == "OK") {
                        $scope.Response = "Your Request has been submitted. Someone will get in touch with you shortly";
                    }
                    else {
                        $scope.Response = "Error Submitting Request, Try again after sometime or send mail";
                    }


                });
            }

            else if($scope.SelAccountType == "Individual")
            {
               
                var date = new Date();
                var user = { UserLogin: $scope.ContactEmail, OrganizationID: 0, Password: "Password@123", Role: "Individual", UserName: $scope.ContactPerson, UserEmail: $scope.ContactEmail, UserMobile: $scope.ContactMobile, Status: "Active", RegisterDate: date, OrgName: "Individual", SolutionType: "Individual" };
                UserService.addUser(user)
                .then(function (res) {
                    $scope.progress = false;
                    if (res.data.Response == "OK") {
                        $scope.Response = "Registered Successfully.";
                    }
                    else {
                        $scope.Response = "Error Submitting Request, Try again after sometime or send mail";
                    }
                });
            }

        }


        $scope.Forgot = function ()
        {
            UserService.ForgotPassword($scope.ContactEmail, $scope.ContactMobile)
            .then(function (res) {
                if (res.data.Response == "OK") {
                    $scope.RecoveryResponse = "New Password has been sent to your Email.";
                }
                else if (res.data.Response == "Error") {
                    $scope.RecoveryResponse = "Mobile or Email is incorrect";
                }
            });
        }

    });

}());