(function () {

    var app = angular.module("gas");
    app.controller("transactionCtrl", function ($timeout, accountService,userService, transactionService, activityService, projectService,advanceService, Excel, $scope, $rootScope, $routeParams, $cookies) {
        $scope.transfer_progress = false;
        $scope.external_progress = false;
        $scope.advance_progress = false;
        $scope.pageno = 1;
        $scope.expenses = [];
        $scope.newTransfer = false;
        $scope.ShowExternal = false;
        $scope.SelUser = "No User Filter";
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";
        //var year = new Date().getFullYear;
        //var Month = new Date();
        $scope.thisDay = new Date();
        $scope.CurrentMonth = new Date();

        $scope.IsLatest = false;

        if (($scope.thisDay.getFullYear() <= $scope.CurrentMonth.getFullYear()) && ($scope.thisDay.getMonth() <= $scope.CurrentMonth.getMonth())) {

            $scope.IsLatest = true;
        }

        if (typeof $routeParams.id != 'undefined') {

            $scope.filterAccount = $routeParams.id;
        }
       
        $scope.Next = function ()
        {
            
            $scope.CurrentMonth.setMonth($scope.CurrentMonth.getMonth() + 1);
            GetTransaction();
            if (($scope.thisDay.getFullYear() <= $scope.CurrentMonth.getFullYear()) && ($scope.thisDay.getMonth() <= $scope.CurrentMonth.getMonth())) {

                $scope.IsLatest = true;
            }
        }

        $scope.Previous = function ()
        {
            $scope.CurrentMonth.setMonth($scope.CurrentMonth.getMonth() - 1);
            GetTransaction();
            if (($scope.thisDay.getFullYear() <= $scope.CurrentMonth.getFullYear()) && ($scope.thisDay.getMonth() <= $scope.CurrentMonth.getMonth())) {

                $scope.IsLatest = true;
            }
            else {
                $scope.IsLatest = false;
            }
        }

       
        $scope.ShowUser = function () {
            $scope.SelectUserForm = true;
            userService.GetAll()
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.UserList = data;
            });
        }

        $scope.SelectUser = function(user)
        {
           
            $scope.SelUser = user.UserName;
            $scope.SelectUserForm = false;
        }

        $scope.TransferUpdate = function () {
            $scope.transfer_progress = true;
            var date = new Date();
           /* var data = {
                TransferName: $scope.transfer_name, TransferRemark: $scope.transfer_remark, TransferAmount: $scope.transfer_amount,
                TFromAccount: $scope.selFromAcc.AccID, TToAccount: $scope.selToAcc.AccID, OrgID: $rootScope.OrgID
            };*/

            var TranData = {
                TransName: $scope.transfer_name, AccID: $scope.selFromAcc.AccID, TransactionID: $scope.selToAcc.AccID, Deposit: $scope.transfer_amount,
                Withdraw: $scope.transfer_amount,TransactionRemarks: $scope.transfer_remark, ProjectID: 0, ActivityID: 0, InvoiceID: 0, ExpenseID: 0,
                OrgID: $rootScope.OrgID,TransactionDate: date,TransType: 'Transfer'
            };
      
            transactionService.Transfer(TranData)
             .then(function (response) {
                 $scope.transfer_progress = false;
                 if (response.data.Response == "OK") {

                     $scope.newTransfer = false;
                     GetTransaction();
                 }
             })
             .catch(function (err) { });
        }





        $scope.SelectActivity = function ()
        {
            activityService.GetAll("Open")
            .then(function (data) {
                $scope.ActivityList = data;
            });
            $scope.ListActivity = true;
        }

        $scope.Select = function (act)
        {
            $scope.SelectedActivity = act;
            $scope.ActivityName = act.ActivityName;
            $scope.ActivityID = act.ActivityID;
            $scope.ListActivity = false;
        }

        $scope.SelectProj = function (prj)
        {
            $scope.SelectedProject = prj;
            $scope.ProjectName = prj.ProjectName;
            $scope.ProjectID = prj.ProjectID;
            $scope.listProject = false;

        }

        $scope.SelectProject = function ()
        {
            $scope.ProjectID =0;
            projectService.getAllProject("Open")
            .then(function (data) {
                $scope.ProjectList = data;
            });
            $scope.listProject = true;
        }


        $scope.PayExternal = function ()
        {
            $scope.external_progress = true;
            var deposit, withdraw;
            if ($scope.type == "Paid")
            {
                deposit = 0;
                withdraw = $scope.external_amount;
            }
            else if ($scope.type == "Received")
            {
                deposit = $scope.external_amount;
                withdraw = 0;
            }
            var date = new Date();
            var TranData = {
                TransName: $scope.external_name, AccID: $scope.selAcc.AccID, Deposit: deposit, Withdraw: withdraw,
                TransactionRemarks: $scope.external_Remarks, ProjectID: 0, ActivityID: 0, InvoiceID: 0, ExpenseID: 0, OrgID: $rootScope.OrgID,
                TransactionDate: date,TransType:'External'
            };
          
           AddTransaction(TranData);
        }

        $scope.PaySalary = function () {
            $scope.salary_progress = true;
            var date = new Date();
            var TranData = {
                TransName: $scope.employee_name + "_Salary", AccID: $scope.selFromAcc.AccID, Deposit: 0, Withdraw: $scope.salary_amount,
                TransactionRemarks: $scope.salary_Remarks, ProjectID: $scope.ProjectID, ActivityID: 0, InvoiceID: 0, ExpenseID: 0,
                TransactionDate: date,OrgID: $rootScope.OrgID,
                TransType:"Salary"
            };
            //alert(JSON.stringify(TranData));

            AddTransaction(TranData);
        }

        $scope.PayAdvance = function () {
            $scope.advance_progress = true;
            var date = new Date();


            var advanceItem = {
                ActivityID: $scope.ActivityID, AdvanceName: "Paid", RequestAmount: 0, ReceiveAmount: $scope.advance_amount,
                AdvanceRemarks: $scope.advance_Remarks, CreationDate: date, SelectedRow: false, Status: "Paid",
                AccID: $scope.selFromAcc.AccID, ProjectID: 0, OrgID: $rootScope.OrgID
            };



            var TranData = {
                TransName: $scope.advance_name, AccID: $scope.selFromAcc.AccID, Deposit: 0, Withdraw: $scope.advance_amount,
                TransactionRemarks: $scope.advance_Remarks, ProjectID: 0, ActivityID: $scope.ActivityID, ExpenseID: 0, OrgID: $rootScope.OrgID,
                TransType:"Advance"
            };

            console.log(JSON.stringify(advanceItem));
            advanceService.addItem(advanceItem)
            .then(function (resp) {
                if (resp.data.Response == "OK") {

                    //AddTransaction(TranData);
                   
                    $scope.advance_progress = false;
                    
                    $scope.newExpense = false;
                    $scope.ShowExternal = false;
                    $scope.newSalary = false;
                    $scope.advance_name = "";
                    $scope.advance_amount = "";
                    $scope.advance_Remarks = "";
                    $scope.ActivityName = "";
                    $scope.external_name = "";
                    $scope.external_amount = "";
                    $scope.external_Remarks = "";
                    $scope.employee_name = "";
                    $scope.salary_amount = "";
                    $scope.salary_Remarks = "";
                    GetTransaction();


                }
                else {
                    alert("Error");
                }
            });

        }


        function AddTransaction(TranData) {
           
            transactionService.AddPayment(TranData)
               .then(function (data) {
                   $scope.external_progress = false;
                   $scope.advance_progress = false;
                   $scope.salary_progress = false;
                   if (data.data.Response == "OK") {
                       $scope.newExpense = false;
                       $scope.ShowExternal = false;
                       $scope.newSalary = false;
                       $scope.advance_name = "";
                       $scope.advance_amount = "";
                       $scope.advance_Remarks = "";
                       $scope.ActivityName = "";
                       $scope.external_name = "";
                       $scope.external_amount = "";
                       $scope.external_Remarks = "";
                       $scope.employee_name = "";
                       $scope.salary_amount = "";
                       $scope.salary_Remarks = "";
                       GetTransaction();
                   }
                   else if (data.data.Response == "Fail") {
                       alert("Could not Update, try later");
                   }
               });

        }

        $scope.sortDate = function (expense) {
            var date = new Date(expense.EntryDate);
            return date;
        };

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
           // alert(1);
            var name = "Transaction_" + $scope.CurrentMonth.getMonth() + "_" + $scope.CurrentMonth.getFullYear();

            $scope.exportHref = Excel.tableToExcel(tableId, name);

            $timeout(function () { location.href = $scope.exportHref; }, 100); // trigger download

        }

        $timeout(function () {

            GetTransaction();


            accountService.getAccountList()
            .then(function (data) {
               //alert(JSON.stringify(data));
                $scope.AccountList = data;
              //  Array.prototype.push.apply($scope.AccountListFilter, data);
                // $scope.AccountListFilter.Concat(data);
              //  $scope.selAccountFilter = $scope.AccountListFilter[0];

            });

        }, 1000);


        function GetTransaction()
        {
            transactionService.getByMonth($scope.CurrentMonth.getFullYear(), $scope.CurrentMonth.getMonth()+1)
              .then(function (data) {
                 
                  if (data === "")
                  { }
                  else
                  {
                      $scope.expenses = data;
                  }
                  
              });

        }

    });

}());