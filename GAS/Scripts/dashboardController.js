(function () {
    var app = angular.module('gas');

    app.controller('dashboardCtrl', function (dashboardService, $timeout, $scope, $rootScope, $cookies) {

        $scope.IPValue = 0;
        $scope.SubmittedValue = 0;
        $scope.ApprovedValue = 0;
        $scope.IPCount = 0;
        $scope.SubmittedCount = 0;
        $scope.ApprovedCount = 0;
        $scope.TodayExpense = 0;

        $timeout(function () {


            GetIPExpenseForEmployee();

        }, 10);

        function GetIPExpenseForEmployee() {
           
            dashboardService.getExpenseByEmpStatus($rootScope.UserId)
                .then(function (data) {
                       

                    for (var i = 0; i < data.length; i++) {
                      
                        if (data[i].Status === 'Added'  ) {
                            $scope.IPValue = data[i].ExpenseAmount;
                            $scope.IPCount = data[i].ActivityCount;
                        
                        }
                        else if (data[i].Status === 'Submitted') {
                            $scope.SubmittedValue = data[i].ExpenseAmount;
                            $scope.SubmittedCount = data[i].ActivityCount;
                        }
                        else if (data[i].Status === 'Approved') {
                            $scope.ApprovedValue = data[i].ExpenseAmount;
                            $scope.ApprovedCount = data[i].ActivityCount;
                        }

                    }

                });

        }

        function GetActiveProject() {

        }

    })

}());