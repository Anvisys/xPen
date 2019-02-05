(function () {

    var app = angular.module("gas");

    app.controller('expenseCtrl', function (expenseService,Excel, $timeout, $scope, $rootScope) {

        $scope.ExpenseType = ["Petrol", "Lunch", "electricity", "Grocerry", "Travel", "Taxi", "Medical", "Others"];
        //$scope.filterType = ["Monthly", "Yearly"];
        //$scope.SelFilterType = $scope.filterType[0];
        //$scope.filterYear = ["2018"];
        //$scope.SelFilterYear = $scope.filterYear[0];
        //$scope.filterMonth = { March: "3", Feb: "2", Jan: "1" };
        //var date = new Date();
        //$scope.SelFilterMonth = (date.getMonth() + 1).toString();
        $scope.SelExpenseType = "Petrol";
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";

        var date = new Date();
        var CurrYear = $scope.SelYear = date.getFullYear();
        var CurrMonth = $scope.SelMonth = date.getMonth() + 1;
        
        $scope.NewExpensePage = function ()
        {
            $scope.NewExpenseDialog = true;
        };

        $scope.CancelExpense = function ()
        {
            $scope.NewExpenseDialog = false;
        }


        $scope.SubmitExpense = function ()
        {
            var date = new Date();
            var expense = {
                ExpenseType: $scope.SelExpenseType, ExpenseAmount: $scope.ExpenseAmount,
                ExpenseDescription: $scope.ExpenseRemark, ExpenseDate: date, SelectedRow: false,
                Status: "Added", UserID: $rootScope.UserId
            };

            expenseService.addExpense(expense)
            .then(function (res) {

                if (res.data.Response == "OK")
                {
                    $scope.ExpenseAmount = "";
                    $scope.ExpenseRemark = "";
                    getExpenseData();
                    getCurrentMonthData($rootScope.UserId, CurrYear, CurrMonth)
                    $scope.NewExpenseDialog = false;
                }
                else {
                    alert("Error Adding Expense");
                }

            });

        }

        //$scope.RefreshData = function()
        //{
        //    alert($scope.SelFilterMonth);
        //    if ($scope.SelFilterType == "Monthly")
        //    {
        //        expenseService.getExpenseDataForMonth($rootScope.UserId, $scope.SelFilterYear, $scope.SelFilterMonth)
        //        .then(function (data) {
        //            $scope.expenseList = data;
        //        });
        //    }
        //    else if ($scope.SelFilterType == "Yearly")
        //    {
        //        expenseService.getExpenseDataForYear($rootScope.UserId, $scope.SelFilterYear)
        //        .then(function (data) {
        //            $scope.expenseList = data;
        //        });
        //    }
        //}


        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            
            var name = $scope.SelYear.toString() + "_" + $scope.SelMonth.toString();

            $scope.exportHref = Excel.tableToExcel(tableId, name);

            $timeout(function () { location.href = $scope.exportHref; }, 100); // trigger download

        }


        $scope.ShowDetail = function (ex)
        {
            $scope.SelYear = ex.Year;
            $scope.SelMonth = ex.Month;
            getCurrentMonthData($rootScope.UserId, ex.Year, ex.Month);
        }

        $timeout( function(){

            getExpenseData();
            getCurrentMonthData($rootScope.UserId, CurrYear, CurrMonth);

        }
            , 10);

        function getExpenseData()
        {
            
            expenseService.getExpenseList($rootScope.UserId)
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.monthList = data;
            });

         
        }

        function getCurrentMonthData(id, year, month)
        {

            expenseService.getExpenseDataForMonth(id, year, month)
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.expenseList = data;
            });
        }

    });




}());