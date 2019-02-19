(function () {

    var app = angular.module('gas');

    app.controller('indexCtrl', function ($timeout,$location,profileService,$scope,$rootScope,$cookies) {
          $rootScope.APIUrl = "http://www.kevintech.in/GAService/";
         //$rootScope.APIUrl = "http://localhost:23699/";
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";
        $scope.showProfileDD1 = false;
        $scope.DDMenu = false;


        $scope.LogOff = function () {
           
          $rootScope.UserId = 0;
          localStorage.users = null;
          localStorage.ProfileImage = null;
          window.location.href = 'Login.html';
        }

        $scope.ProfileEdit=function()
        {

            $scope.showProfileDD1 = false;
        }


        $scope.ShowDDMenu = function ()
        {
         
            $scope.DDMenu = !$scope.DDMenu;
        }

        $scope.getClass = function (path) {
           
            $scope.CurrentClass = $location.path();
            var strClass = ($location.path().substr(1, path.length) === path) ? 'active' : '';
            return strClass;
        }

        $scope.ShowProfile1 = function () {
            $scope.showProfileDD1 = !$scope.showProfileDD1;
        };
    


        //$scope.ShowProfile = function () {
        //    $scope.showProfileDD = !$scope.showProfileDD;
        //};

        $scope.init = function () {
                if (localStorage.users === null || typeof  localStorage.users === 'undefined') {
                window.location.href = 'Login.html';
                return;
                }
                else if (localStorage.users === null) {
                        window.location.href = 'Login.html';
                        return;
                    }
                    else {
                        var UserObj = JSON.parse(localStorage.users);
                        $rootScope.Email = UserObj.UserEmail;
                        $rootScope.UserMobile = UserObj.UserMobile;
                        $rootScope.Role = UserObj.UserRole;
                        $rootScope.UserId = UserObj.UserId;
                        
                        $rootScope.UserName = UserObj.UserName;
                        $rootScope.OrgName = UserObj.OrgName;
                        $rootScope.OrgID = UserObj.OrgId;
                        $rootScope.SolutionType = UserObj.AccountType;
                        $rootScope.ImageData = localStorage.ProfileImage;
                        $rootScope.UserToken = UserObj.UserToken;
                       // $location.url('main');
                        //$rootScope.AbsUrl = "http://localhost:23699/";

                        //  alert(JSON.parse(localStorage.users).UserRole);
                    /*       if (JSON.parse(localStorage.users).UserRole == "Individual") {
                            $location.url('expense');
                        }
                        else if (JSON.parse(localStorage.users).UserRole == "SuperAdmin") {
                            $location.url('request');
                        }
                        else if (JSON.parse(localStorage.users).UserRole == "Admin") {
                            $location.url('main');
                        }
                        else if (JSON.parse(localStorage.users).UserRole == "Manager") {
                            $location.url('project');
                        }
                    */
                        }
                                   
                    profileService.GetImage($rootScope.UserId)
                       .then(function (data) {
                           //alert(JSON.stringify(data));
                           if (data.ImageByte != "")
                           {
                              
                               localStorage.ProfileImage = $rootScope.ProfileImage = "data:image/jpeg;base64," + data.ImageByte;
                           }
                           else {
                               localStorage.ProfileImage = $rootScope.ProfileImage = "Images/Icon/profile.jpg";
                           }
                             });
    };

    $timeout($scope.init);
    });

})();
