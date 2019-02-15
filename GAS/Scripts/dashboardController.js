(function () {
    var app = angular.module('gas');

    app.controller('dashboardCtrl', function (dashboardService, dailyExpenseService, expenseItemService, $timeout, $scope, $rootScope, $cookies) {

        $scope.IPValue = 0;
        $scope.SubmittedValue = 0;
        $scope.ApprovedValue = 0;
        $scope.IPCount = 0;
        $scope.SubmittedCount = 0;
        $scope.ApprovedCount = 0;
        $scope.TodayExpense = 0;

        $scope.ActiveProjectsCount = 0;
        $scope.ActiveProjects = [{}];

        $timeout(function () {

            GetActiveProject();
            GetIPExpenseForEmployee();

            GetDayWiseExpense();
            GetLatestExpenses();

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

            dashboardService.getActiveProjects($rootScope.UserId)
                .then(function (data) {
                  
                   $scope.ActiveProjectsCount = data.length;
                    $scope.ActiveProjects = data;
                });
        }


        function GetDayWiseExpense() {
            $scope.UserPayable = 0;
            $scope.InProcess = 0;
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            dailyExpenseService.getDailyExpenseForEmployee($rootScope.UserId)
                .then(function (data) {
                  

                   // $scope.dailyExpenseData = data.$values;

                    for (i = 0; i < data.length; i++) {
                        Expense.push(data[i].ExpenseAmount);
                        Received.push(data[i].ReceiveAmount);
                        $scope.labels.push(new Date(data[i].ExpenseDate).getDate());

                    }

                    $scope.dailyExpenseData = [Expense, Received];

                });
        }

        function GetLatestExpenses() {
        
            expenseItemService.getExpenseDataForEmployee($rootScope.UserId)
                .then(function (data) {
                    alert(JSON.stringify(data));
                    $scope.latestExpenses = data.$values;

                });
        }

    })

}());