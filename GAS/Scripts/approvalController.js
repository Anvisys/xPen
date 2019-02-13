(function () {
    var app = angular.module('gas');

    app.controller('approvalCtrl', function (activityService,profileService,expenseItemService,accountService,transactionService,advanceService, $timeout, $scope, $rootScope, $cookies) {
        $scope.Status = [ "Show All","Open", "Close"];

        $scope.selStatus = "Open";
        $scope.UserImages = {};
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";



        $scope.ToggleFilter = function ()
        {
            $scope.ShowFilter = !$scope.ShowFilter;
        }

        $scope.ShowClose = function () {
            getDataForApproval("Closed");
          
        }

        $scope.ShowOpen = function () {
            getDataForApproval("Open");
            $scope.ShowFilter = false;

        }

        $scope.ShowAll = function () {
            getDataForApproval("Show All");
            $scope.ShowFilter = false;
        }



        $scope.ToggleAdvanceFilter = function () {
            $scope.ShowAdvanceFilter = !$scope.ShowAdvanceFilter;
        }

        $scope.ShowCloseAdvance = function () {
            GetAdvanceData("Closed");

        }

        $scope.ShowOpenAdvance = function () {
            GetAdvanceData("Open");
            $scope.ShowAdvanceFilter = false;

        }

        $scope.ShowAllAdvance = function () {
            GetAdvanceData("All");
            $scope.ShowAdvanceFilter = false;
        }


        $scope.Approve = function (ip) {
            $scope.selActivity = ip;
            $scope.approveDiv = true;
        }

        $scope.Cancel = function () {
            $scope.approveDiv = false;
            $scope.paymentDiv = false;
            $scope.rejectDiv = false;
            $scope.paymentAdvance = false;
        }


        $scope.ApproveSubmit = function () {
            var date = new Date();
            var expenseItem = [{
                ActivityID: $scope.selActivity.ActivityID, ItemName: "StatusUpdate", ExpenseAmount: 0,
                ReceiveAmount: 0, ExpenseDescription: $scope.appRemarks, ExpenseDate: date, SelectedRow: false, Action: "Approved"
            }];
            console.log(JSON.stringify(expenseItem));
            expenseItemService.addItem(expenseItem)
            .then(function (resp) {
                if (resp.data.Response == "OK") {
                    $scope.approveDiv = false;
                    $scope.appRemarks = "";
                    getDataForApproval();
                }
                else {
                    alert("Error");
                }
            });
        }


        $scope.PayForm = function (obj) {
            $scope.selActivity = obj;
            $scope.payment_name = obj.ActivityName;
            $scope.selAcc = $scope.Accounts[0];
            $scope.paid_Amount = obj.Expenses - obj.Settlement - obj.Advance;
            $scope.ProjectID = obj.ProjectID;
            $scope.paymentDiv = true;
        }

        $scope.PaySubmit = function () {

            var date = new Date();
  
            var PaymentData = {
                ProjectID: $scope.ProjectID, ActivityID: $scope.selActivity.ActivityID, ExpenseID: 0, OrgID: $rootScope.OrgID,
                ExpenseAmount:  $scope.paid_Amount,AccID:$scope.selAcc.AccID,ItemName: $scope.payment_name,Action:"Paid",
                ExpenseDescription: $scope.paid_Remarks,ExpenseDate: date, 
            };
            //console.log( JSON.stringify(PaymentData));
            //alert(PaymentData);
            expenseItemService.addPayment(PaymentData)
            .then(function (resp) {
                if (resp.data.Response == "OK") {
                       $scope.paymentDiv = false;
                }
                else {
                    alert("Error");
                }
            });
        }


        $scope.Reject = function (ip)
        {
            $scope.selActivity = ip;
            $scope.rejectDiv = true;

        }

        $scope.ApproveAdv = function (adv) {
            $scope.selAdvance = adv;
            $scope.approveAdvance = true;
        }



        $scope.AdvanceApproveSubmit = function () {
            var date = new Date();
            var advanceItem = {
                ActivityID: $scope.selAdvance.ActivityID, AdvanceName: "Approve", RequestAmount: 0, ReceiveAmount: 0,
                AdvanceRemarks: $scope.advRemarks, CreationDate: date, SelectedRow: false, Status: "Approved"
            };

            advanceService.addItem(advanceItem)
            .then(function (resp) {
                if (resp.data.Response == "OK") {
                    $scope.approveAdvance = false;
                    $scope.advRemarks = "";
                    GetAdvanceData();
                }
                else {
                    alert("Error");
                }
            });
        }

        $scope.RejectAdv = function (adv)
        {
            $scope.selAdvance = adv;
            $scope.rejectAdvance = true;
        }

        $scope.AdvanceRejectSubmit = function ()
        {
            var date = new Date();
            var advanceItem = {
                ActivityID: $scope.selAdvance.ActivityID, AdvanceName: "Reject", RequestAmount: 0, ReceiveAmount: 0,
                AdvanceRemarks: $scope.advRejectRemarks, CreationDate: date, SelectedRow: false, Status: "Rejected"
            };

            advanceService.addItem(advanceItem)
            .then(function (resp) {
                if (resp.data.Response == "OK") {
                    $scope.rejectAdvance = false;
                    $scope.advRejectRemarks = "";
                    GetAdvanceData("Open");
                }
                else {
                    alert("Error");
                }
            });

        }

        $scope.PayFormAdv = function(adv)
        {
            $scope.selAdvance = adv;
            $scope.advance_name = adv.ActivityName;
            $scope.selAcc = $scope.Accounts[0];
            $scope.advance_Amount = adv.RequestAmount;
            $scope.ActivityID = adv.ActivityID;
            $scope.paymentAdvance = true;
        }

        $scope.PayAdvanceSubmit = function ()
        {
            var date = new Date();
            var advanceItem = {
                ActivityID: $scope.ActivityID, AdvanceName: "Paid", RequestAmount: 0,
                ReceiveAmount: $scope.advance_Amount, AdvanceRemarks: $scope.advance_Remarks, CreationDate: date,
                SelectedRow: false, Status: "Paid",
                AccID: $scope.selAcc.AccID, ProjectID: 0, OrgID: $rootScope.OrgID
            };
            var TranData = { TransName: $scope.advance_name, AccountNumber: $scope.selAcc.AccID, Deposit: 0, Withdraw: $scope.advance_Amount, TransactionRemarks: $scope.advance_Remarks, ProjectID: 0, ActivityID: $scope.ActivityID, ExpenseID: 0 };

            console.log(JSON.stringify(advanceItem));
            return;

            advanceService.addItem(advanceItem)
            .then(function (resp) {
                if (resp.data.Response == "OK") {
                   
                    //AddTransaction(TranData);
                    $scope.paymentDiv = false;
                    $scope.appRemarks = "";
                    $scope.paymentAdvance = false;
                    $scope.advance_Remarks = "";
                    getDataForApproval();

                    GetAdvanceData();

                }
                else {
                    alert("Error");
                }
            });

        }


        function AddTransaction(TranData) {
            
            transactionService.AddPayment(TranData)
               .then(function (data) {
                   
                   if (data.data.Response == "OK") {
                       $scope.paymentDiv = false;
                       $scope.appRemarks = "";
                       $scope.paymentAdvance = false;
                       $scope.advance_Remarks = "";
                       getDataForApproval();

                       GetAdvanceData();
                   }
                   else if (data.data.Response == "Fail") {
                       alert("Could not Update, try later");
                   }
               });

        }

        $scope.RejectSubmit = function () {
            var date = new Date();
            var expenseItem = [{
                ActivityID: $scope.selActivity.ActivityID, ItemName: "StatusUpdate", ExpenseDescription: $scope.rejRemark,
                ExpenseAmount: 0, ReceiveAmount: 0, Remarks: $scope.rejRemark, ExpenseDate: date, SelectedRow: false, Action: "Rejected"
            }];

            expenseItemService.addItem(expenseItem)
            .then(function (resp) {
                if (resp.data.Response == "OK") {
                    $scope.rejectDiv = false;
                    $scope.appRemarks = "";
                    getDataForApproval("Open");
                }
                else {
                    alert("Error");
                }
            });

        }

        $scope.FilterData = function ()
        {
            getDataForApproval();
            GetAdvanceData();
        }

        $timeout(function () {

            $scope.UserID = $rootScope.UserId;
            getDataForApproval("Open");
            GetAdvanceData("Open");
            accountService.getAccountList()
               .then(function (data) {
                   
                   $scope.Accounts = data;
               });


        }, 10);

        function getDataForApproval(status) {

            if ($rootScope.Role == "Manager") {

                activityService.GetActivitiesByApprover($scope.UserID, status)
                     .then(function (data) {
                         //alert(JSON.stringify(data));
                         $scope.reviewList = data;

                         for (i = 0; i < data.length; i++) {
                             GetSetImage(data[i].EmployeeID);

                             GetSetImage(data[i].Approver)
                         }
                     });
            }
            else if ($rootScope.Role == "Admin") {
              
                activityService.GetAll(status)
                     .then(function (data) {
                         //alert(JSON.stringify(data));
                         $scope.reviewList = data;

                         for (i = 0; i < data.length; i++) {
                             GetSetImage(data[i].EmployeeID);
                         }
                     });
            }
      }


        function GetSetImage(id) {
            profileService.GetImage(id)
                              .then(function (data) {

                                  var img = "UserImage_" + id;
                                  if (data.ImageByte != "") {
                                      //alert(data.ImageByte);
                                      $scope.UserImages[img] = "data:image/jpeg;base64," + data.ImageByte;
                                      // $scope[eval(UImage)] = "data:image/jpeg;base64," + data.ImageByte;
                                  }
                                  else {
                                      $scope.UserImages[img] = "Images/Icon/profile.jpg";
                                  }
                                  // $scope.UserImage_1008 = "Images/Icon/profile.jpg";

                              });

        }



        function GetAdvanceData(status) {
           
            if ($rootScope.Role == "Manager") {

                advanceService.getAdvanceForApprover($scope.UserID, status)
                     .then(function (data) {
                        
                         $scope.advanceItems = data;
                     });
            }
            else if ($rootScope.Role == "Admin") {

                advanceService.getAll(status)
                     .then(function (data) {
                     
                         $scope.advanceItems = data;
                     });
            }

        }

    });

}());