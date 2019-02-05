(function () {
    'use strict';

    angular
        .module('login')
        .controller('loginCtrl', LoginController)
       .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    LoginController.$inject = ['$scope', '$rootScope', 'UserService', '$location', '$timeout'];

    function LoginController($scope, $rootScope, UserService, $location, $timeout) {

          //  $rootScope.APIUrl = "http://localhost:23699/";
               $rootScope.APIUrl = "http://www.kevintech.in/GAService/";
        $rootScope.Role = "Visitor";
        $scope.showlogin = false;
        $scope.progress = false;
        $scope.ToggelLogin = function () {
            $location.url('home');
            $scope.showlogin = !$scope.showlogin;
        }

        $scope.GoToRegister = function ()
        {
            $scope.showlogin = false;
            $location.url('register');
        }

        $scope.LogOff = function () {

            $rootScope.Role = "Visitor";
            $rootScope.UserName = "";
            localStorage.users = null;
        }

        $scope.response = "";
        $scope.progress = false;

        $scope.CheckLogin = function () {
          
            $scope.progress = true;
            var login = { User_Login: $scope.userLogin, User_Password: $scope.userPassword };

            //var UserObject = { name: "Amit Bansal",UserID:"1", Role: "Manager", Email: "amit.bansal1973@gmail.com", Mobile: "9591033223" };

            UserService.GetValidUser(login)
             .then(function (response) {
                 $scope.progress = false;
                 $scope.userPassword = "";
                 if (response.data.UserName === "Error") {
                     $scope.response = "Wrong User Name or Password!"
                     //alert("Wrong User Name or Password");
                 }
                 else {

                     localStorage.users = JSON.stringify(response.data);

                     if (response.data.UserRole == 'SuperAdmin') {
                    
                         window.location.href = 'Index.html#!/main';
                     }
                     else if (JSON.parse(localStorage.users).UserRole == "Individual") {
                         $location.url('expense');
                         window.location.href = 'Index.html#!/activity';
                     }
                     else if (JSON.parse(localStorage.users).UserRole == "Employee") {
                         
                        //$location.url('expense');
                         window.location.href = 'Index.html#!/employedashboard';
                     }
                    else if (JSON.parse(localStorage.users).UserRole == "Admin") {
                         //$location.url('main');
                         window.location.href = 'Index.html#!/main';
                     }
                     else if (JSON.parse(localStorage.users).UserRole == "Manager") {
                         
                         window.location.href = 'Index.html#!/managerdashboard';
                     }

                 }

             })
                .catch(function (err) {
                    $scope.progress = false;
                    alert("Login Failed, Contact Admin");
                });


        }


    }

})();
