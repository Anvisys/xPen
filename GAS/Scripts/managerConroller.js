(function () {
    var app = angular.module('gas');

    app.controller('mgrCtrl', function (dashboardService, dailyExpenseService, $timeout, $scope, $rootScope, ) {

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

        $timeout(function () {

            // Manager Function
            GetIPExpenseForManager();
            GetIPSalesForManager();
            GetIPPurchaseForManager();
            GetTodayExpenseForManager();
            GetDayWiseExpenseForManager();

        }, 10);



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
            dashboardService.getIPSalesForManager($rootScope.UserId, 100)
                .then(function (data) {

                    for (var i = 0; i < data.length; i++) {
                        $scope.Receivable = $scope.Receivable + data[i].Receivable;
                        $scope.ReceivedAmount = $scope.ReceivedAmount + data[i].ReceivedAmount;

                    }
                });
        }

        function GetIPPurchaseForManager() {

            $scope.DueAmount = 0;

            dashboardService.getIPPurchaseForManager($rootScope.UserId, 100)
                .then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.Payable = $scope.Payable + data[i].Payable;
                        $scope.PaidAmount = $scope.PaidAmount + data[i].PaidAmount;
                        var invDate = new Date(data[i].InvoiceDate);
                        var date = new Date(new Date().getTime() - 7 * 24 * 60 * 60);


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