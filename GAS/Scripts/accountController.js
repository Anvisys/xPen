(function () {
    var app = angular.module('gas');

    app.controller('accountCtrl', function (accountService, transactionService, $timeout, $scope, $rootScope, $cookies) {
        $scope.newAccount_progress = false;
        $scope.chartColors = ["#ffc67f", "#3a3a4d", "#0ed2c4"];
        $scope.series = ['Withdraw', 'Deposit'];

        var contentHeight = window.innerHeight - 100;
        $scope.ScreenHeight = contentHeight + "px";

       var row1 = 0.6* contentHeight;
        var row2 = 0.4 * contentHeight;
        $scope.row1Height = row1 + "px";
        $scope.row2Height = row2 + "px";

        $scope.status = {
            isopen: false
        };

        $scope.toggled = function (open) {
            alert(2);
        };

        $scope.DDClick = function ()
        {
            alert(1);
        }

        $scope.toggleDropdown = function ($event) {
            alert(1);
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
            
        $scope.OpenNewAccount = function () {

            $scope.newAccountDiv = true;
        }

        $scope.cancel = function () {
            $scope.newAccountDiv = false;
        }

        $scope.AddAccount = function () {
            $scope.newAccount_progress = true;
            var AccountData = { Name: $scope.accName, Type: $scope.accType, Number: $scope.accNumber, AccountDescription: $scope.accDesc, OrgID: $rootScope.OrgID };
            accountService.addAccount(AccountData)
            .then(function (res) {
                $scope.newAccount_progress = true;
                if (res.data.Response == "OK") {
                    $scope.accName = "";
                    $scope.accType = "";
                    $scope.accNumber = "";
                    $scope.accDesc = "";
                    $scope.newAccountDiv = false;
                    GetAccounts();
                }
                else {
                    alert("Error");
                }

            });

        }



        $timeout(function () {
            GetAccounts();
            GetDailyTransaction();
        }, 10);

        function GetAccounts()
        {
            accountService.getAccountListByOrg($rootScope.OrgID)
                 .then(function (data) {

                     $scope.Accounts = data;
                 });
        }


        $scope.ShowTrend = function(acc)
        {
            if (acc == 'All')
            { GetDailyTransaction(); }
            else{
            $scope.accName = acc.AccountName;
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            transactionService.getDailyAccountTransaction(acc.AccID)
              .then(function (data) {
                  $scope.transactionList = data.$values;

                  for (i = 0; i < data.$values.length; i++) {
                      Expense.push(data.$values[i].ExpenseAmount);
                      Received.push(data.$values[i].ReceiveAmount);
                      $scope.labels.push(new Date(data.$values[i].ExpenseDate).getDate());
                  }
              
                  $scope.data = [Expense, Received];
                  chartColors = ['#C0392B', '#196F3D'];
              });
        }
        }

    

        function GetDailyTransaction()
        {
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            transactionService.getDailyTransaction()
            .then(function (data) {

                $scope.transactionList = data.$values;

                for (i = 0; i < data.$values.length; i++) {
                    Expense.push(data.$values[i].ExpenseAmount);
                    Received.push(data.$values[i].ReceiveAmount);
                    $scope.labels.push(new Date(data.$values[i].ExpenseDate).getDate());
                }

                $scope.data = [Expense, Received];
                chartColors = ['#C0392B', '#196F3D'];
          
            });
        }



    });



}());