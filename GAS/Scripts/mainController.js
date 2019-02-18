(function () {

    var app = angular.module("gas");
    app.controller("mainCtrl", function (accountService, transactionService, expenseItemService,dashboardService, invoiceService,taxService, $timeout, $scope, $rootScope, $cookies) {

        $scope.AccountList = [];
        $scope.ActivitySummary = [];
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";
        $scope.GST_Paid = 0;
        $scope.CurrentMonth = new Date();
        $scope.Receivable = 0;
        $scope.ReceivedAmount = 0;
        $scope.Payable = 0;
        $scope.PaidAmount = 0;


            $timeout(function () {
                GetAccountList();
              
                GetDailyTransaction();
                GetDayExpenses();

                GetTaxData();
                var date = new Date();
                GetTransactionForDate(date.toUTCString());
                GetUnpaidInvoice();

                GetTransaction();

                GetIPSalesForAdmin();
                GetIPPurchaseForAdmin();
            }, 10);


            function GetAccountList() {
            if ($rootScope.Role === 'Admin') {

                accountService.getAccountList()
                     .then(function (data) {

                         $scope.AccountList = data;
                     });
            }
           
        }

        function GetTransactionForDate(date) {
           
            transactionService.getTransactionByDate(date)
            .then(function (data) {
               // alert(JSON.stringify(data));
                 $scope.todayTransaction = data.$values;
                
            });
        }

        function GetDailyTransaction() {
            transactionService.getDailyTransaction()
            .then(function (data) {
              //  $scope.ExpenseList = data.$values;
              // alert(JSON.stringify(data));

                data.$values.map(function (value) {
                    // Assuming there's a timestamp in the _time key
                    value.ExpenseDate = new Date(value.ExpenseDate);
                    //alert(JSON.stringify(value));
                    return value;

                });
                $scope.todayWithdrawl = data.$values[0].ExpenseAmount;
                $scope.todayDeposit = data.$values[0].ReceiveAmount;
                $scope.currentBalance = data.$values[0].Balance;
                $scope.data = data;
                SetTransactionOption();
            });
        }


        function GetDayExpenses() {
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            // expenseItemService.getExpenseData()
            expenseItemService.getDailyOrganizationExpense()
                .then(function (data) {
                   
                $scope.expenseList = data.$values;
                
                for (i = 0; i < data.$values.length; i++) {
                    Expense.push(data.$values[i].ExpenseAmount);
                    Received.push(data.$values[i].ReceiveAmount);
                    $scope.labels.push(new Date(data.$values[i].ExpenseDate).getDate());
                }
                $scope.todayExpense = data.$values[0].ExpenseAmount;
                $scope.expensedata = [Expense, Received];
                //$scope.expensedata = data;
                //SetexpenseOption();
            });
        }

        function SetTransactionOption() {
            $scope.transactionOptions = {
                   series: [
                    {
                        axis: "y",
                        dataset: "$values",
                        key: "ReceiveAmount",
                        label: "Received",
                        type: ["column"],
                        color: "hsla(88,48%,48%,90)",
                        id: 'Series1',
                        thickness: '5px'
                    },
                     {
                         axis: "y",
                         dataset: "$values",
                         key: "ExpenseAmount",
                         label: "Spent",
                         type: ["column"],
                         color: "#79c7e0",
                         thickness: '15px',
                         id: 'Series2'

                     },
                      {
                          axis: "y",
                          dataset: "$values",
                          key: "Balance",
                          defined: function (value) {
                              return value.y1 !== undefined;
                          },
                          label: "Balance",
                          type: ["dot","line","area"],
                          color: "#000000",
                          id: 'Series3'

                      }
                ],
                axes: {
                    x: {
                        key: "ExpenseDate",
                        type: "date"
                         }
        
                },
                margin: {
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 10
                },
                grid: {
                    x: true,
                    y: true
                },
                columnsHGap: 5,
                columnVGap: 5
             
            };

        }

        function SetexpenseOption() {
            $scope.expenseOptions = {
                margin: { top: 5000, left:20 },
                series: [
                    {
                        axis: "y",
                        dataset: "$values",
                        key: "ReceiveAmount",
                        label: "ReceiveAmount",
                        type: ["column"],
                        
                        color: "hsla(88,48%,48%,10)",
                        id: 'Series1'
                    },
                     {
                         axis: "y",
                         dataset: "$values",
                         key:"ExpenseAmount",
                         label: "Spent",
                         type: ["column"],
                         color: "#79c7e0",
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


        function GetUnpaidInvoice()
        {
           
            invoiceService.getUnpaidSell()
           .then(function (data) {
          //     alert(JSON.stringify(data));
               if (data != null) {
                   $scope.UnpaidInvoice = data;
               }

           });

        }


        function GetTaxData() {
            $scope.TDS_Paid = 0;
            taxService.GetLastTDS()
            .then(function (data) {
              
               
                if (data != null) {
                    $scope.TaxMonth = data.TaxMonth;
                    $scope.TDSPayable = data.TDSPayable;
                    $scope.TDS_Paid = data.TDS_Paid;
                    $scope.TransactionDate = data.TransactionDate;
                }
               
            });

            taxService.GetLastGST()
           .then(function (data) {
               if (data != null) {
                   $scope.TaxMonth = data.TaxMonth;
                   $scope.GSTPayable = data.GSTPayable;
                   $scope.GST_Paid = data.GST_Paid;
                   $scope.GSTTransactionDate = data.TransactionDate;
               }
           });
        }

        function GetTransaction() {
            $scope.currMDeposit = 0;
            $scope.currMWithdraw = 0;

            $scope.CurrentBalance = 0;
            $scope.LastTransaction = 0;
            $scope.AccountName = "";

            transactionService.getByMonth($scope.CurrentMonth.getFullYear(), $scope.CurrentMonth.getMonth() + 1)
                .then(function (data) {

                    if (data === "") { }
                    else {
                        if (data[0].Deposit) {
                            $scope.LastTransaction = - data[0].Withdraw;
                        }
                        else {
                            $scope.LastTransaction = data[0].Deposit;
                        }
                        $scope.currMDeposit = $scope.currMDeposit + data[0].Deposit;
                        $scope.currMWithdraw = $scope.currMWithdraw + data[0].Withdraw;

                        $scope.CurrentBalance = data[0].Balance;

                        $scope.AccountName = data[0].AccountName;
                    }

                });

        }

        function GetIPSalesForAdmin() {
            dashboardService.getIPSalesForAdmin( 100)
                .then(function (data) {

                    for (var i = 0; i < data.length; i++) {
                        $scope.Receivable = $scope.Receivable + data[i].Receivable;
                        $scope.ReceivedAmount = $scope.ReceivedAmount + data[i].ReceivedAmount;

                    }
                });
        }

        function GetIPPurchaseForAdmin() {

            $scope.DueAmount = 0;

            dashboardService.getIPPurchaseForAdmin( 100)
                .then(function (data) {
                    console.log(JSON.stringify(data));
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

    });

})();