(function () {

    var app = angular.module('gas');

    app.controller("expenseItemCtrl", function (activityService, expenseItemService, advanceService,$location, $timeout, $scope, $routeParams, $rootScope) {

        $scope.ActivityID = $routeParams.id;
        $scope.expenseItems = [];
        $scope.tempexpenses = [];
        $scope.item_date = new Date();
        $scope.UserID = $rootScope.UserId;
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";

        $scope.Submit = function () {
            var date = new Date();
            var expenseItem = [{ ActivityID: $scope.ActivityID, ItemName: "StatusUpdate", ExpenseAmount: 0, ReceiveAmount: 0, ExpenseDescription: "Submitted for Approval", ExpenseDate: date, SelectedRow: false, Status: "Submitted" }];
            expenseItemService.addItem(expenseItem)
            .then(function (res) {
                if (res.data.Response == "OK") {
                    //$location.path("activity");
                    SetActivity();
                    GetData();
                }
                else {
                    alert("Error");
                }


            });
        }


        $scope.ShowNewItemForm = function () {
           $scope.NewItemForm = true;
        }

        $scope.cancel = function () {
          
            $scope.NewItemForm = false;
            $scope.advanceDiv = false;
        }

        $scope.AddExpenseItem = function()
        {
            var expItem = {
                ActivityID: $scope.ActivityID, ItemName: $scope.item_name, ExpenseAmount: $scope.item_amount,
                ReceiveAmount: 0, ExpenseDescription: $scope.item_description, ExpenseDate: $scope.item_date, SelectedRow: false, Status: 'Added'
            };
          
            
            $scope.tempexpenses.push(expItem);
           
            localStorage.tempExpense = JSON.stringify($scope.tempexpenses);
           
            $scope.item_name = "";
            $scope.item_amount = "";
            $scope.item_description = "";
            NewItemForm = false;
        }

        $scope.ClearTempData = function()
        {
            $scope.tempexpenses=[];
            localStorage.tempExpense = null;
        }

        $scope.SaveAtServer = function()
        {
         
          JSON.stringify($scope.tempexpenses);
        
            expenseItemService.addItem($scope.tempexpenses)
            .then(function (res) {
                if (res.data.Response == "OK")
                {
                    $scope.tempexpenses = [];
                    localStorage.tempExpense = null;
                    $scope.NewItemForm = false;
                    GetData();
                }
                else
                {
                    alert("Error Updating");
                }

            });
        }

        $scope.Delete = function (eItem) {
            expenseItemService.deleteItem(eItem)
            .then(function (res) {
                if (res.data.Response == "OK") {
                    GetData();
                }
                else {
                    alert("Error Updating");
                }

            });
        }


        $scope.AdvanceForm = function()
        {
            $scope.advanceDiv = true;
        }

        $scope.RequestAdvance = function ()
        {

            var date = new Date();
            var advanceItem = {
                ActivityID: $scope.ActivityID, AdvanceName: "Advance Request", RequestAmount: $scope.advAmount,
                ReceiveAmount: 0, AdvanceRemarks: $scope.advRemarks, CreationDate: date, SelectedRow: false, Status: "Submitted"
            };
            advanceService.addItem(advanceItem)
            .then(function (res) {
                if (res.data.Response == "OK") {
                    GetAdvanceData();
                    $scope.advanceDiv = false;
                }
                else {
                    alert("Error");
                }


            });
        }




        $timeout(function () {
            if (typeof localStorage.tempExpense != 'undefined') {
                
                if (localStorage.tempExpense === 'null') {
                    $scope.tempexpenses = [];
                }
                else {
                     $scope.tempexpenses = JSON.parse(localStorage.tempExpense);
                    }
            }

            SetActivity();
            GetData();
            GetAdvanceData();
        }, 10);

        function SetActivity()
        {
              activityService.GetByActivityID($scope.ActivityID)
                    .then(function (res) {

                        $scope.ProjectName = res.ProjectName;
                        $scope.ActivityName = res.ActivityName;
                        $scope.ActivityStatus = res.ActivityStatus;
                    });
        }

        function GetData() {
            expenseItemService.getExpenseDataForActivity($scope.ActivityID).
            then(function (data) {
             //alert(JSON.stringify(data));
                $scope.expenseItems = data;

            });

        }

        function GetAdvanceData() {
            advanceService.getAdvanceForActivity($scope.ActivityID).
            then(function (data) {
                //alert(JSON.stringify(res));
                $scope.advanceItems = data;

            });

        }

    });



})();