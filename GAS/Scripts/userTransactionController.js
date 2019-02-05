
(function () {

    var app = angular.module('gas');

    app.controller('userTransactionCtrl', function (userService, transactionService, Excel, $timeout, $scope, $rootScope, $routeParams) {
        $scope.thisMonth = new Date();
        $scope.CurrentMonth = new Date();
       
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";
       
        if (typeof $routeParams.id != 'undefined') {

            $scope.selected_id = $routeParams.id;

        
        }

        $scope.SeeMore = function () {
            $('.SeeMore2').click(function () {
                var $this = $(this);
                $this.toggleClass('SeeMore2');
                if ($this.hasClass('SeeMore2')) {
                    $this.text('My Expense');
                } else {
                    $this.text('Project Expense');
                }
            });
        }

        $scope.Next = function () {
          
            $scope.CurrentMonth.setMonth($scope.CurrentMonth.getMonth() + 1);
            GetTransaction();

        }

        $scope.Previous = function () {
            $scope.CurrentMonth.setMonth($scope.CurrentMonth.getMonth() - 1);
            GetTransaction();
        }

        $scope.GetUser = function (user)
        {
             $scope.selectedUser = user;
             $scope.ShowUserForm = false;
             $scope.UserName = user.UserName;
            $scope.UserID = user.UserId;
        }


        $scope.ShowUsers = function () {
            $scope.ShowUserForm = true;
            //userService.GetAll()
            //.then(function (data) {
            //    //alert(JSON.stringify(data));
            //    $scope.UserList = data;
            //});
        }

        $scope.GetUserList = function () {
           
            var strHint = $scope.UserHint;
            userService.GetByFilter(strHint)
            .then(function (data) {
              
                $scope.UserList = data.$values;
            });

          
        }



        $timeout(function () {
          
            
            GetUser();

        }, 10);

        function GetTransaction(id) {

            if ($scope.CurrentMonth.getFullYear() == $scope.thisMonth.getFullYear() && $scope.CurrentMonth.getMonth() == $scope.thisMonth.getMonth()) {
                $scope.ShowNext = false;
            }
            else {
       
                $scope.ShowNext = true;
            }
            transactionService.getForUserByMonth(id,$scope.CurrentMonth.getFullYear(), $scope.CurrentMonth.getMonth() + 1)
              .then(function (data) {

                  if (data === "")
                  { }
                  else
                  {
                      $scope.expenses = data;
                  }

              });

        }

        function GetUser() {

            userService.GetUserByID($scope.selected_id )
                .then(function (data) {
                    $scope.selectedUser = data;
                                      
                    $scope.UserName = $scope.selectedUser.UserName;
                    $scope.UserID = $scope.selectedUser.UserId;
                    GetTransaction($scope.selected_id );
                 
                });

        }

    });
}());