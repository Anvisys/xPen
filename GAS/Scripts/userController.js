(function () {

    var app = angular.module("gas");
    app.controller("userCtrl", function (userService,profileService, activityService,expenseItemService, $timeout, $scope, $rootScope, $cookies) {
        $scope.chartColors = ["#db3e49", "#0e1cd2", "#0ed2c4"];
        $scope.roles = ["Admin", "Manager", "Employee"];
        $scope.user_role = "Employee";
        $scope.userList = [];
        $scope.newUserDiv = false;
        $scope.newUser_progress = false;
        
        $scope.UserPayable = 0;
        $scope.InProcess = 0;
        $scope.prefix = 'UserImage_';      
        $scope.UserImages = {};
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";

        $scope.NewUser = function() {
            $scope.newUserDiv = true;
        }

        $scope.Close = function() {
            $scope.newUserDiv = false;
        }


        $scope.ShowDetail = function (user)
        {


        }

        $scope.ToggleFilter = function () {

            $scope.ShowFilter = !$scope.ShowFilter;
        }


        $scope.Remove = function(user)
        {
            $scope.SelectedUser = user;
            $scope.ConfirmRemoval = true;
        }

        $scope.UserRemove = function()
        {
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

        $scope.UserAdd = function() {
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
                       
                       $scope.response ="!Failed to Update";
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

        $scope.GetUser=function()
        {
            userService.GetByMobile($scope.SearchMobile)
                            .then(function (data) {
                               console.log(JSON.stringify(data));

                                if (data == null)
                                {
                                    $scope.UserText = "No User matching Mobile.";
                                }
                               else if (data.OrgId == $rootScope.OrgID)
                                {

                                    $scope.UserText = "User " + data.UserName + "(" + data.UserMobile +") already added in organization.";
                               }
                               else if (data.OrgId != 0)
                               {
                                    $scope.UserText = "User " + data.UserName + "(" + data.UserMobile+") is part of some organization;";

                               }
                               else if (data.OrgId == 0)
                                {

                                  // $scope.UserName = data.UserName + " " + data.UserMobile + " " + data.UserEmail;
                                    $scope.UserText = "User Name :" + data.UserName + "(" + data.UserMobile + "), Email : " + data.UserEmail
                                        + ";";
                                    $scope.SelectedUser = data;

                                }
                                
                            });
        }


        $scope.Show = function(user)
        {
            GetEmployeeActivitiesData(user.UserId);
            GetEmployeeExpenseData(user.UserId);
            $scope.selectedUser = user.UserName;
        }

        $timeout(function () {
           // $rootScope.myImage = $rootScope.ProfileImage;
            GetUserData();
           
        }, 10);

        function GetUserData()
        {
            userService.GetAll($rootScope.OrgID)
                .then(function (data) {
                    //alert(JSON.stringify(data));
                    $scope.userList = data;
                    GetEmployeeActivitiesData(data[0].UserId);
                    GetEmployeeExpenseData(data[0].UserId);
                    $scope.selectedUser = data[0].UserName;
                   
                    for (i = 0; i < data.length; i++) {
                        GetSetImage(data[i].UserId);
                    }

                });
        }

        function GetSetImage(id)
        {
            profileService.GetImage(id)
                              .then(function (data) {
                                 
                                  var img = "UserImage_" + id;
                                  if (data.ImageByte != "") {
                                      //alert(data.ImageByte);
                                      $scope.UserImages[img] = "data:image/jpeg;base64," + data.ImageByte;
                                     // $scope[eval(UImage)] = "data:image/jpeg;base64," + data.ImageByte;
                                  }
                                  else {
                                      $scope.UserImages[img] = "Images/Icon/profile.jpg";
                                  }
                                 // $scope.UserImage_1008 = "Images/Icon/profile.jpg";
                                 
                              });

        }


        function GetEmployeeActivitiesData(id)
        {
           
            activityService.GetActivitiesByEmployee(id, "Open")
            .then(function (data) {
           
                $scope.userActivities = data.$values;


                //data.$values.map(function (value) {
                //    // Assuming there's a timestamp in the _time key
                //    value.UpdatedOn = new Date(value.UpdatedOn);
                //    //alert(JSON.stringify(value));
                //    return value;
                //})

                //$scope.userExpensedata = data;
                //SetOption();
            });
        }

        function GetEmployeeExpenseData(id)
        {
            $scope.UserPayable = 0;
            $scope.InProcess = 0;
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            //expenseItemService.getExpenseDataForEmployee(id)
            userService.GetDailyExpense(id)
                .then(function (data) {
                    if (data.$values === undefined || data.$values.length == 0) {
                    return;
                }
                else {
                    $scope.expenseList = data.$values;

                    for (i = 0; i < data.$values.length; i++) {
                        Expense.push(data.$values[i].ExpenseAmount);
                        Received.push(data.$values[i].ReceiveAmount);
                        $scope.labels.push(new Date(data.$values[i].ExpenseDate).getDate());

                        if (data.$values[i].Status == "Approved") {
                            $scope.UserPayable = $scope.UserPayable + data.$values[i].ExpenseAmount - data.$values[i].ReceiveAmount;
                        }
                        else {
                            $scope.InProcess = $scope.InProcess + data.$values[i].ExpenseAmount - data.$values[i].ReceiveAmount;
                        }
                    }

                    $scope.userdata = [Expense, Received];
                }
            });
        }

        function SetexpenseOption() {
            $scope.userExpenseOptions = {
                    series: [
                    {
                        axis: "y",
                        dataset: "$values",
                        key: "ReceiveAmount",
                        defined: function (value) {
                            return value.y1 !== undefined;
                        },
                        label: "Received",
                        type: ["column"],
                        color: "hsla(88,48%,48%,10)",
                        thickness: '15px',
                        id: 'Series1'
                    },
                     {
                         axis: "y",
                         dataset: "$values",
                         key: "ExpenseAmount",
                         defined: function (value) {
                             return value.y1 !== undefined;
                         },
                         label: "Spent",
                         type: ["column"],
                         color: "#79c7e0",
                         thickness: '15px',
                         id: 'Series2'

                     }

                ],
                axes: {
                    x: {
                        key: "ExpenseDate",
                        type: "date"

                    }
                }

            };

        }

    });

})();