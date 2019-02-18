(function () {

    var app = angular.module("gas");
    app.controller("projectDetailCtrl", function ($timeout,activityService,userService,  projectService,invoiceService,transactionService,accountService,  $scope, $rootScope, $routeParams, $cookies) {
       
        $scope.PrjId = $routeParams.id;
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";
        $scope.invoice_date = new Date();
        $scope.pwork_cost = 0;
        $scope.pCGST = 0;
        $scope.pSGST = 0;
        $scope.pIGST = 0;
        $scope.pTDS = 0;
        $scope.CGST = 0;
        $scope.SGST = 0;
        $scope.IGST = 0;
        $scope.TDS = 0;
        $scope.model = {};
        $scope.receive_date = new Date();
        $scope.pinvoice_date = new Date();
        $scope.model.trans_date = new Date();
       
  
        $scope.model.trans_name = "test";
        $scope.EmployeeName = $rootScope.UserName;
        $scope.EmployeeID = $rootScope.UserId;

        $scope.alertMe = function (index) {
            alert(index);
            $scope.selected = index;
        }

        $scope.filterBytype = function (Trans) {
            return ($scope.selectedTypes.indexOf(Trans.TransType) !== -1);
        };
        $scope.newSaleInvoiceDivOpen = function () {
            $scope.model.newSalesInvoiceDiv = true;
            $scope.vendor_name = "";
            $scope.invoice_number = "";
            $scope.work_cost = 0;
            $scope.CGST = 0;
            $scope.SGST = 0;
            $scope.IGST = 0;
            $scope.TDS = 0;
            $scope.receive_date = new Date();
            $scope.project_description = "";
        }


        $scope.AddSellInvoice = function ()
        {
            
            var Invoice = {
                InvoiceNumber: $scope.invoice_number, OrgId: $scope.OrgID, ProjectId: $scope.PrjId,
                ServiceCost: $scope.work_cost, CGST: $scope.CGST, SGST: $scope.SGST, IGST: $scope.IGST,TDS:0,TDS:$scope.TDS,
                InvoiceDate: $scope.invoice_date, InvoiceType: 0
            };
            $scope.sales_progress = true;
            invoiceService.addSellInvoice(Invoice)
            .then(function (resp) {
                $scope.sales_progress = false;
                // alert(JSON.stringify(resp));
                if (resp.data.Response == "OK") {
                    $scope.work_cost = 0;
                    $scope.CGST = 0;
                    $scope.SGST = 0;
                    $scope.IGST = 0;
                    $scope.TDS = 0;
                
                    $scope.model.newInvoiceDiv = false;
                    GetInvoiceData();
                }
                else if (resp.data.Response == "Fail") {
                    alert("Error");
                }

            });


        }


        $scope.newPurchaseInvoiceDivOpen = function () {
            $scope.model.newPurchaseInvoiceDiv = true;
            $scope.vendor_name = "";
            $scope.pinvoice_number = "";
            $scope.pwork_cost = 0;
            $scope.pCGST = 0;
            $scope.pSGST = 0;
            $scope.pIGST = 0;
            $scope.pTDS = 0;
            $scope.pinvoice_date = new Date();
            $scope.project_description = "";
        }

        $scope.AddPurchaseInvoice= function()
        {
            var Invoice = {
                InvoiceNumber: $scope.pinvoice_number, VendorName: $scope.vendor_name, OrgId: $scope.OrgID, ProjectId: $scope.PrjId,
                ServiceCost: $scope.pwork_cost, CGST: $scope.pCGST, SGST: $scope.pSGST, IGST: $scope.pIGST, TDS: $scope.pTDS,
                InvoiceDate: $scope.pinvoice_date, InvoiceType: 1
            };

            $scope.purchase_progress = true;
            invoiceService.addPurchaseInvoice(Invoice)
            .then(function (resp) {
                $scope.purchase_progress = false;
                // alert(JSON.stringify(resp));
                if (resp.data.Response == "OK") {
                    $scope.pwork_cost = 0;
                    $scope.pCGST = 0;
                    $scope.pSGST = 0;
                    $scope.pIGST = 0;
                    $scope.pTDS = 0;

                    $scope.model.newPurchaseInvoiceDiv = false;
                    GetPurchaseInvoiceData();
                }
                else if (resp.data.Response == "Fail") {
                    alert("Error");
                }

            });

        }


        $scope.model.receivePayment = function (invoice)
        {
           // alert(invoice);
            $scope.selInvoice = invoice;
            $scope.newReceivePaymentDiv = true;
            $scope.trans_remarks = "";
            $scope.received_cost = invoice.ServiceCost;
            $scope.received_GST = invoice.IGST + invoice.CGST + invoice.SGST;
            $scope.received_TDS = invoice.TDS;
       
        }

        $scope.AddPayment = function ()
        {
            var CostTransaction = {
                TransName: "Cost_" + $scope.Project.ProjectName, AccID: $scope.selAcc.AccID, Deposit: $scope.received_cost, Withdraw: 0,
                TransactionRemarks: $scope.trans_remarks, ProjectID: $scope.PrjId, ActivityID: 0, ExpenseID: 0, TransactionID: 0, InvoiceID: $scope.selInvoice.InvoiceId,
                OrgID: $scope.OrgID, TransType: "Sell", TransactionDate: $scope.receive_date
            };

            var GSTTransaction = {
                TransName: "GST_" + $scope.Project.ProjectName, AccID: $scope.selAcc.AccID, Deposit: $scope.received_GST, Withdraw: 0,
                TransactionRemarks: $scope.trans_remarks, ProjectID: $scope.PrjId, ActivityID: 0, ExpenseID: 0, TransactionID: 0, InvoiceID: $scope.selInvoice.InvoiceId,
                OrgID: $scope.OrgID, TransType: "GST", TransactionDate: $scope.receive_date
            };

            var TDSTransaction = {
                TransName: "TDS_" + $scope.Project.ProjectName, AccID: $scope.selAcc.AccID, Deposit: -$scope.received_TDS, Withdraw: 0,
                TransactionRemarks: $scope.trans_remarks, ProjectID: $scope.PrjId, ActivityID: 0, ExpenseID: 0, TransactionID: 0, InvoiceID: $scope.selInvoice.InvoiceId,
                OrgID: $scope.OrgID, TransType: "TDS", TransactionDate: $scope.receive_date
            };

          var item =[CostTransaction, GSTTransaction, TDSTransaction];
            console.log(JSON.stringify(item));

            $scope.paymentReceive_progress = true;

            transactionService.AddPayment(item)
                .then(function (data) {

                    $scope.paymentReceive_progress = false;
                       if (data.data.Response == "OK") {
                           $scope.received_cost = 0;
                           $scope.received_GST = 0;
                           $scope.received_tds = 0;
                           $scope.newReceivePaymentDiv = false;
                          
                           GetInvoiceData();
                          
                       }
                       else if (data.data.Response == "Fail") {
                           alert("Could not Update, try later");
                       }
                   });

        }

        $scope.PayOther = function ()
        {
            $scope.other_progress = true;
        
            var TranData = {
                TransName: $scope.model.trans_name, AccID: $scope.model.selAccount.AccID, Deposit: 0, Withdraw: $scope.model.trans_amount,
                TransactionRemarks: $scope.model.trans_Remarks, ProjectID: $scope.PrjId, ActivityID: 0, ExpenseID: 0, TransactionID: 0,
                InvoiceID: 0, OrgID: $scope.OrgID,
                TransType: "Other", TransactionDate: $scope.model.trans_date
            };
            //$scope.other_progress = false;
           AddTransaction(TranData);
        }

    
        $scope.makePayment = function (invoice) {
            $scope.selInvoice = invoice;
            $scope.newMakePaymentDiv = true;
            $scope.paid_cost = 0;
            $scope.payment_Remarks = "";
        }

    

        $scope.Pay = function () {
            var Payment = {
                PInvoiceId: $scope.selInvoice.InvoiceId, OrgId: $scope.OrgID, ProjectId: $scope.PrjId,
                Paid: $scope.paid_cost, TaxPaid: 0, TDSPayable: 0,TDSStatus: "Payble",
                PaymentDate: $scope.receive_date
            };


            var TranData = {
                TransName: "Payment_" + $scope.selInvoice.InvoiceId, AccID: $scope.selAcc.AccID, Deposit: 0, Withdraw: $scope.paid_cost,
                TransactionRemarks: $scope.payment_Remarks, ProjectID: $scope.PrjId, ActivityID: 0, ExpenseID: 0,TransactionID:0, InvoiceID: $scope.selInvoice.InvoiceId, OrgID: $scope.OrgID,
                TransType: "Purchase", TransactionDate: $scope.receive_date
            };
            $scope.purchasePayment_progress = true;
            AddTransaction(TranData);

        /*    invoiceService.makePayment(Payment)
            .then(function (resp) {
                $scope.project_progress = false;
                // alert(JSON.stringify(resp));
                if (resp.data.Response == "OK") {

                    AddTransaction(TranData);
                   
                    //GetInvoiceData();
                }
                else if (resp.data.Response == "Fail") {
                    alert("Error");
                }

            });*/

        }


        function AddTransaction(TranData) {
            transactionService.AddPayment(TranData)
                .then(function (data) {
                    $scope.other_progress = false;
                    $scope.purchasePayment_progress = false;
                    if (data.data.Response == "OK") {
                        $scope.received_cost = 0;
                        $scope.received_tax = 0;
                        $scope.received_tds = 0;
                        $scope.newReceivePaymentDiv = false;
                        $scope.paid_cost = 0;
                        $scope.newMakePaymentDiv = false;
                        GetInvoiceData();
                        GetPurchaseInvoiceData();
                    }
                    else if (data.data.Response == "Fail") {
                        alert("Could not Update, try later");
                    }
                });

        }

        $scope.LoadActivity = function ()
        {
           // alert("Getting Activities" + $scope.PrjId);
           // GetActivitiesForProject();
        }

        $scope.OpenEmployeeDialog = function ()
        {
          
            $scope.model.SelectUserForm = true;
            userService.GetAll()
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.UserList = data;
            });
        }


        $scope.Select = function(user)
        {
            
            $scope.model.SelectUserForm = false;
            $scope.EmployeeName = user.UserName;
            $scope.EmployeeID = user.UserId;
          
        }

        $scope.QuickExpense = function () {
            $scope.expense_amount = 0;
            $scope.expense_remarks = "";
            $scope.expense_name = "";
            $scope.model.QuickExpenseForm = true;
        }

        $scope.AddQuickExpense = function () {
            $scope.QuickExpense_progress = true;
            var date = new Date();
            var Activity = {
                ActivityName: $scope.expense_name, EmployeeID: $rootScope.UserId,
                ProjectID: $scope.PrjId, CreatedBy: $rootScope.UserId,
                ActivityDescription: $scope.expense_remarks, CreationDate: date, ExpenseAmount: $scope.expense_amount,
                ActivityStatus: "Submitted", OrgID: $rootScope.OrgID, ApproverID: $rootScope.UserId
            };

            activityService.CreateActivity(Activity)
                .then(function (resp) {
                    $scope.QuickExpense_progress = false;
                    if (resp.data.Response == "OK") {
                        $scope.model.QuickExpenseForm = false;
                        GetActivitiesForProject($scope.PrjId)
                    }
                    else {
                        alert("Error");
                    }

                });
        }

        $scope.NewActivityForm = function () {
            $scope.model.activity_name = "";
            $scope.model.activity_remarks = "";

            $scope.model.NewActivityForm = true;
        }

        $scope.AddActivity = function()
        {
            $scope.newActivity_progress = true;
            var date = new Date();
            var Activity = {
                ActivityName: $scope.model.activity_name, EmployeeID: $scope.EmployeeID,
                ProjectID: $scope.PrjId, CreatedBy: $rootScope.UserId,
                ActivityDescription: $scope.model.activity_remarks, CreationDate: date, ExpenseAmount: 0,
                ActivityStatus: "Initiated", OrgID: $rootScope.OrgID, ApproverID: $rootScope.UserId
            };

       
            activityService.CreateActivity(Activity)
            .then(function (resp) {
                $scope.newActivity_progress = false;
              
                if (resp.data.Response == "OK") {
                    $scope.model.NewActivityForm = false;
                    GetActivitiesForProject($scope.PrjId);
                }
                else {
                    alert("Error Creating Activity");
                }

            });

        }

        $timeout(function () {
            GetProjectData();
            GetInvoiceData();
            GetPurchaseInvoiceData();
            GetTransactionForProject();
            GetActivitiesForProject();
            GetAccountList();

        }, 10);


        function GetAccountList() {
            accountService.getAccountList()
                .then(function (data) {

                    $scope.Accounts = data;
                    $scope.selAcc = data[0];
                });


        }

        function GetTransactionForProject() {

            transactionService.GetForProject($scope.PrjId)
                .then(function (data) {
                    $scope.model.transactionList = data;
                });
        }



        function GetProjectData()
        {
            projectService.getProjectData($scope.PrjId)
            .then(function (data) {
                console.log(JSON.stringify(data));
                $scope.Project = data[0];

            });

        }

     

        function GetInvoiceData()
        {
            $scope.sellItems = {};
            invoiceService.getSellForProject($scope.PrjId)
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.model.InvoiceList = data;

            });
        }
      
        function GetPurchaseInvoiceData() {
            $scope.purchaseItems = {};
            invoiceService.getPurchaseForProject($scope.PrjId)
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.model.PurchaseInvoiceList = data;

            });
        }


        function GetActivitiesForProject() {
          
            activityService.GetActivitiesByProject($scope.PrjId)
            .then(function (data) {
             
                $scope.model.ActivityList = data;

            });
        }

    });

})();