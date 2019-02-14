(function () {

    var app = angular.module("gas");
    app.controller("taxCtrl", function (invoiceService,accountService,transactionService,projectService,taxService, $timeout, $scope, $rootScope) {

        var contentHeight = window.innerHeight - 350;
        $scope.ScreenHeight = contentHeight + "px";
        $scope.TotalTDS = 0;
        $scope.PurchaseList = [];
        $scope.SellList = [];
        $scope.thisDay = new Date();
        $scope.CurrentMonth = new Date();
        $scope.latestShowing = false;

        if (($scope.thisDay.getFullYear() <= $scope.CurrentMonth.getFullYear()) && ($scope.thisDay.getMonth() <= $scope.CurrentMonth.getMonth()) ) {
           
            $scope.latestShowing = true;
        }

  
        $scope.Next = function () {

            $scope.CurrentMonth.setMonth($scope.CurrentMonth.getMonth() + 1);

            $scope.tax = {};
            $scope.year = $scope.CurrentMonth.getFullYear();
            $scope.month = $scope.CurrentMonth.getMonth() + 1;
          
            GetSellData();
            GetPurchaseData();
            GetTaxPaidList();
            GetTDSBaseline();
            GetGSTBaseline();
            if (($scope.thisDay.getFullYear() <= $scope.CurrentMonth.getFullYear()) && ($scope.thisDay.getMonth() <= $scope.CurrentMonth.getMonth())) {
                $scope.latestShowing = true;
            }
            

        }

        $scope.Previous = function () {
            $scope.CurrentMonth.setMonth($scope.CurrentMonth.getMonth() - 1);

            $scope.tax = {};
            $scope.year = $scope.CurrentMonth.getFullYear();
            $scope.month = $scope.CurrentMonth.getMonth() + 1;
            
            GetSellData();
            GetPurchaseData();
            GetTaxPaidList();
            GetTDSBaseline();
            GetGSTBaseline();
            $scope.latestShowing = false;
          
        }



        $scope.EditTDS = function (tds)
        {
            $scope.ShowTDSForm = true;
            $scope.TDS_Payable = TDS
            $scope.tds_penalty = 0;
        }
        
        $scope.PayTDS= function(TDS)
        {
            $scope.ShowTDSForm = true;
            $scope.TDS_Payable = TDS
            $scope.tds_penalty = 0;
            $scope.tds_amount = TDS + $scope.tds_penalty;
        }

        $scope.SubmitTDS = function () {
            var TranData = {
                TransName: "TDS_" + $scope.year + "_" + $scope.month, AccID: $scope.selFromAcc.AccID, Deposit: 0, Withdraw: $scope.tds_amount,
                TransactionRemarks: $scope.trans_remarks, ProjectID: 0, ActivityID: 0, ExpenseID: 0, OrgID: $rootScope.OrgID,
                TransactionID: 0, InvoiceID: $scope.TDS_ID,
                TransType: "TDS", TransactionDate: $scope.transaction_date
            };

            transactionService.AddPayment(TranData)
              .then(function (data) {

                  if (data.data.Response == "OK") {
                      $scope.ShowTDSForm = false;
                      $scope.trans_remarks = "";
                      $scope.tds_amount = "";
                  }
                  else if (data.data.Response == "Fail") {
                      alert("Could not Update, try later");
                  }
              });

        }


        $scope.PayGST = function (p)
        {
            $scope.ProjectName = "SelectProject";
            $scope.ProjectID = 0;
            $scope.ShowGSTForm = true;
        }

        $scope.SubmitGST = function ()
        {
            $scope.GST_progress = true;
            var TranData = {
                TransName: "GST_" + $scope.ProjectName, AccID: $scope.selFromAcc.AccID, Deposit: 0, Withdraw: $scope.gst_amount,
                TransactionID: 0, InvoiceID: 0,
                TransactionRemarks: $scope.trans_remarks, ProjectID: $scope.ProjectID, ActivityID: 0, ExpenseID: 0, OrgID: $rootScope.OrgID,
                TransType: "GST", TransactionDate: $scope.payment_date
            };

            transactionService.AddPayment(TranData)
              .then(function (data) {
                  $scope.GST_progress = false;
                  if (data.data.Response == "OK") {
                      $scope.ShowGSTForm = false;
                      $scope.trans_remarks = "";
                      $scope.gst_amount = "";
                  }
                  else if (data.data.Response == "Fail") {
                      alert("Could not Update, try later");
                  }
              });

        }

        $scope.BaselineTDS = function ()
        {
            var TDS = {
                TDSDeducted: $scope.items.deducted, OrgID: $rootScope.OrgID, TDSPayable: $scope.tds_amount,
                PreviousTDS: 0, Penalty: 0, TaxMonth: $scope.CurrentMonth
            }
           // alert(JSON.stringify(TDS));
            taxService.baselineTDS(TDS)
            .then(function (data) {
                $scope.tds_amount = 0;
                $scope.showTDSBaseline = false;
            });

        }


        $scope.BaselineGST = function () {
            var GST = {
                GSTReceived: $scope.tax.IGST, OrgID: $rootScope.OrgID, GSTInput: $scope.tax.IGSTI,
                PreviousGSTDues: 0, GSTPayable: $scope.gst_amount, Penalty: 0, TaxMonth: $scope.CurrentMonth
            }
            // alert(JSON.stringify(TDS));
            taxService.baselineGST(GST)
            .then(function (data) {
                $scope.gst_amount = 0;
                $scope.showGSTBaseline = false;
            });

        }


        $scope.SelectProject = function ()
        {
            $scope.ProjectID = 0;
            projectService.getAllProject("Open")
            .then(function (data) {
                $scope.ProjectList = data;
            });

            $scope.listProject = true;

        }

        $scope.SelectProj = function (prj) {
            $scope.SelectedProject = prj;
            $scope.ProjectName = prj.ProjectName;
            $scope.ProjectID = prj.ProjectID;
            $scope.listProject = false;

        }

        $timeout(function () {
            $scope.CurrentMonth = new Date();
            $scope.year = $scope.CurrentMonth.getFullYear();
            $scope.month = $scope.CurrentMonth.getMonth() + 1;
            //alert($scope.year + "/" + $scope.month);
            GetSellData();
            GetPurchaseData();
            GetTaxPaidList();

            GetTDSBaseline();
            GetGSTBaseline();
            accountService.getAccountList()
           .then(function (data) {
              
               $scope.AccountList = data;
           

           });

        }, 10);



        function GetSellData()
        {
            invoiceService.getSell($scope.year, $scope.month)
            .then(function (data) {
            
                $scope.SellList = data;
            });
        }

        function GetPurchaseData() {
            $scope.PurchaseList = [];
            $scope.items = {};
            invoiceService.getPurchase($scope.year, $scope.month)
            .then(function (data) {
             
                $scope.PurchaseList = data;
               
            });
        }


        function GetTaxPaidList()
        {
            transactionService.getTaxPaid($scope.year, $scope.month)
            .then(function (data) {

                $scope.taxPaidList = data;
            });

        }

        function GetTDSBaseline()
        {
            taxService.GetTDS($scope.year, $scope.month)
            .then(function (data) {
               
                if (typeof data == 'undefined')
                {
                    $scope.IsTDSBaseline = false;
                }
                else if (data == null)
                {
                   
                    $scope.IsTDSBaseline = false;
                }
                else if (data.TransactionRemarks == "NoData")
                {
                    $scope.IsTDSBaseline = false;
                }
                else
                {
                    $scope.IsTDSBaseline = true;
                    //$scope.taxPaidList = data;
                    $scope.TDS_ID = data.ID;
                    $scope.prevTDS = data.PreviousTDS;
                    $scope.TDS_Payable = data.TDSPayable;
                    $scope.paidTDS = data.TDS_Paid;
                    $scope.TransDate = data.TransactionDate;
                    $scope.TransRemarks = data.TransactionRemarks;
                }
               
                

            });
        }



        function GetGSTBaseline() {
            taxService.GetGST($scope.year, $scope.month)
            .then(function (data) {
              
                if (typeof data == 'undefined') {
                    $scope.IsGSTBaseline = false;
                }
                else if (data == null) {
                   
                    $scope.IsGSTBaseline = false;
                }
                else if (data.TransactionRemarks == "NoData") {
                    $scope.IsGSTBaseline = false;
                }
                else {
                    $scope.IsGSTBaseline = true;
                    //$scope.taxPaidList = data;
                    $scope.GST_ID = data.GSTId;
                    $scope.GST_Previous = data.PreviousGSTDues;
                    $scope.GST_Payable = data.GSTPayable;
                    $scope.GST_Paid = data.GST_Paid;
                    $scope.gstTransDate = data.TransactionDate;
                    $scope.gstTransRemarks = data.TransactionRemarks;
                }



            });
        }

    });

    })();