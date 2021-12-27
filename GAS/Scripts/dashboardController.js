(function () {
    var app = angular.module('gas');

    app.controller('dashboardCtrl', function (dashboardService, dailyExpenseService, constService, expenseItemService, $timeout, $scope, $rootScope, $cookies) {

        $scope.IPValue = 0;
        $scope.SubmittedValue = 0;
        $scope.ApprovedValue = 0;
        $scope.IPCount = 0;
        $scope.SubmittedCount = 0;
        $scope.ApprovedCount = 0;
        $scope.TodayExpense = 0;
        $scope.Receivable = 0;
        $scope.ReceivedAmount = 0;
        $scope.Payable = 0;
        $scope.PaidAmount = 0;
        $scope.MgrAdded = 0;
        $scope.MgrSubmitted = 0;
        $scope.MgrApproved = 0;
        $scope.ActiveProjectsCount = 0;
        $scope.ActiveProjects = [{}];

        if ($rootScope.Role == "Admin") {
            ShowAdmin();
        }
        else if ($rootScope.Role == "Manager") {
            ShowManager();
        }
        else {
            ShowEmployee();
        }

        $scope.ShowAdmin = function () {
            ShowAdmin();
        }
        $scope.ShowManager = function () {
            ShowManager();
        }
        $scope.ShowEmployee = function () {
            ShowEmployee();
        }

        function ShowAdmin() {
            $scope.AdminDashboard = true;
            $scope.ManagerDashboard = false;
            $scope.EmployeeDashboard = false;
            $scope.Dashboard = "Admin Dashboard";
        }

        function ShowManager() {
            $scope.AdminDashboard = false;
            $scope.ManagerDashboard = true;
            $scope.EmployeeDashboard = false;
            $scope.Dashboard = "Manager Dashboard";
        }

        function ShowEmployee() {
            $scope.AdminDashboard = false;
            $scope.ManagerDashboard = false;
            $scope.EmployeeDashboard = true;
            $scope.Dashboard = "Employee Dashboard";
        }

        $timeout(function () {

            GetActiveProject();
            GetIPExpenseForEmployee();

            GetDayWiseExpense();
            GetLatestExpenses();


            /* Manager Function
            GetIPExpenseForManager();
            GetIPSalesForManager();
            GetIPPurchaseForManager();
            GetTodayExpenseForManager();
            GetDayWiseExpenseForManager();
           */
            $scope.BannerImage = constService.ImageRootDirectory + 'society-image.jpg';

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
                 
                    $scope.latestExpenses = data.$values;

                });
        }

        function GetIPExpenseForManager() {

            dashboardService.getExpenseByManagerStatus($rootScope.UserId)
                .then(function (data) {
                 
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].Status === 'Added') {
                            $scope.IPMgrValue = data[i].ExpenseAmount;
                            $scope.IPMgrCount = data[i].ActivityCount;

                        }
                        else if (data[i].Status === 'Submitted') {
                            $scope.SubmittedMgrValue = data[i].ExpenseAmount;
                            $scope.SubmittedMgrCount = data[i].ActivityCount;
                        }
                        else if (data[i].Status === 'Approved') {
                            $scope.ApprovedMgrValue = data[i].ExpenseAmount;
                            $scope.ApprovedMgrCount = data[i].ActivityCount;
                        }

                    }

                });

        }
        
        function GetTodayExpenseForManager() {

            dashboardService.getTodayExpenseForManager($rootScope.UserId)
                .then(function (data) {
                  
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].Status === 'Added') {
                            $scope.MgrAdded = data[i].ExpenseAmount;
                           
                        }
                        else if (data[i].Status === 'Submitted') {
                            $scope.MgrSubmitted = data[i].ExpenseAmount;
                         
                        }
                        else if (data[i].Status === 'Approved') {
                            $scope.MgrApproved = data[i].ExpenseAmount;
                       
                        }

                    }
                });

        }

        function GetIPSalesForManager() {
            dashboardService.getIPSalesForManager($rootScope.UserId,100)
                .then(function (data) {
                   
                    for (var i = 0; i < data.length; i++) {
                        $scope.Receivable = $scope.Receivable + data[i].Receivable;
                        $scope.ReceivedAmount = $scope.ReceivedAmount + data[i].ReceivedAmount;

                    }
                });
        }

        function GetIPPurchaseForManager() {

            $scope.DueAmount = 0;

            dashboardService.getIPPurchaseForManager($rootScope.UserId,100)
                .then(function (data) {
                    console.log(JSON.stringify(data));
                    for (var i = 0; i < data.length; i++) {
                        $scope.Payable = $scope.Payable + data[i].Payable;
                        $scope.PaidAmount = $scope.PaidAmount + data[i].PaidAmount;
                        var invDate = new Date(data[i].InvoiceDate);
                        var date = new Date(new Date().getTime() - 7*24*60*60);
                        

                        if (invDate > date) {
                            $scope.DueAmount = $scope.DueAmount + data[i].Payable;
                        }
                    }
                });
        }

        function GetDayWiseExpenseForManager() {
         
            var mgrExpense = [];
            var mgReceived = [];
            $scope.Mgrlabels = [];
            dailyExpenseService.getDailyExpenseForManager($rootScope.UserId)
                .then(function (data) {
                  
                    for (i = 0; i < data.length; i++) {
                     
                        mgrExpense.push(data[i].ExpenseAmount);
                        mgReceived.push(data[i].ReceiveAmount);
                        $scope.Mgrlabels.push(new Date(data[i].ExpenseDate).getDate());

                    }

                    $scope.dailyMgrExpenseData = [mgrExpense, mgReceived];

                });
        }

       

    })

}());
