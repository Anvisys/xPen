(function () {

    var app = angular.module("gas");
    app.controller("projectCtrl", function ($timeout, activityService, projectService, dailyExpenseService, accountService, transactionService, $scope, $rootScope, $cookies) {
        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.ProjectList = [];
        $scope.newProjectDiv = false;
        $scope.types = ['Cash', 'Checque', 'Online'];
        $scope.newPaymentDiv = false;
        $scope.status_progress = false;
        $scope.payment_progress = false;
        $scope.project_progress = false;
        $scope.actions = ["Action", "Update", "Show"];
        $scope.SelectedAction = "Action";

        $scope.ProjectFilterName = "Show Close Project";
        $scope.FilterStatus = "Open";
        var contentHeight = window.innerHeight - 200;
        var row1 = 0.6 * contentHeight;
        var row2 = 0.4 * contentHeight;
        $scope.screenHeight = contentHeight + "px";
        $scope.row1Height = row1 + "px";
        $scope.row2Height = row2 + "px";

        $scope.ToggleFilter = function ()
        {

            $scope.ShowFilter = !$scope.ShowFilter;
        }

        $scope.Event = function (p)
        {
            
            alert(p.ProjectName);
            alert($scope.SelectedAction);
            //$scope.SelectedAction = "Action";
        }

        $scope.lessThan = function (prop, val) {
            return function (item) {
                return item[prop] > val;
            }
        }

        $scope.ShowClose = function ()
        {
            GetProjectList("Closed");
          
        }

        $scope.ShowOpen = function () {
            GetProjectList("Open");
            $scope.ShowFilter = false;
          
        }

        $scope.ShowAll = function () {
            GetProjectList("All");
            $scope.ShowFilter = false;
        }

        $scope.open = function () {
            $scope.newProjectDiv = true;
            $scope.ShowFilter = false;
        };

        $scope.cancel = function () {
            $scope.newProjectDiv = false;
            $scope.newPaymentDiv = false;
            $scope.newStatusDiv = false;
        };


        $scope.AddProject = function () {
            $scope.project_progress = true;
            var projectData = {
                ProjectNumber: $scope.project_number, ClientName: $scope.clientName, ProjectName: $scope.project_name,
                ProjectValue: $scope.project_value, ProjectDescription: $scope.project_description,
                CreatedBy: $rootScope.UserId, OrgID:$rootScope.OrgID
            };

           // alert(projectData);
            projectService.addProject(projectData)
            .then(function (resp) {
                $scope.project_progress = false;
               // alert(JSON.stringify(resp));
                if (resp.data.Response == "OK") {
                    $scope.project_number = "";
                    $scope.project_name = "";
                    $scope.project_value = "";
                    $scope.clientName = "";
                    $scope.project_description = "";

                    $scope.newProjectDiv = false;
                    GetProjectList(status);
                }
                else if (resp.data.Response == "Fail") {
                    alert("Error");
                }

            });

        };



        $scope.editPayment = function(prj)
        {
            alert("Not In Use");
            $scope.ProjectName = prj.ProjectName;
            $scope.ProjectID = prj.ProjectID;
            accountService.getAccountList()
                 .then(function (data) {
                     //alert(JSON.stringify(data));
                     $scope.AccountList = data;
                 });

            $scope.newPaymentDiv = true;

        }

      

        $scope.PaymentUpdate = function () {
            $scope.payment_progress = true;
            var amtWithdraw, amtDeposit;

            var entrydate = new Date();

            var data = {
                TransName: $scope.TName, AccID: $scope.selAcc.AccID, Withdraw: 0, Deposit: $scope.Amount,
                ProjectID: $scope.ProjectID, ActivityID: 0, Balance: 0, TransactionRemarks: $scope.Remarks, OrgID: $rootScope.OrgID
            };

            // alert(JSON.stringify(data));
            transactionService.AddPayment(data)
            .then(function (res) {
                $scope.payment_progress = false;
                if (res.data.Response == "OK") {
                    $scope.ProjectName = "";
                    $scope.newPaymentDiv = false;

                }
                else if (res.data.Response == "Fail") {
                    alert("Error");
                }

            })
            .catch(function (err) {

                alert(err);
            });

        }

        $scope.editStatus = function (prj)
        {
            $scope.ProjectName = prj.ProjectName;
            $scope.ProjectID = prj.ProjectID; 
            $scope.ProjectCompletion = prj.WorkCompletion;
            $scope.StatusRemark = prj.StatusRemark;
            $scope.ProjectStatus = prj.Status;
            $scope.newStatusDiv = true;
        }


        $scope.StatusUpdate = function () {
            $scope.status_progress = true;
            var data = {
                WorkCompletion: $scope.ProjectCompletion, Remarks: $scope.StatusRemark, Status: $scope.ProjectStatus,
                ProjectID: $scope.ProjectID
            };

     
            projectService.UpdateStatus(data)
            .then(function (res) {
                $scope.status_progress = false;
                if (res.data.Response == "OK") {
                    $scope.ProjectName = "";
                    $scope.newStatusDiv = false;
                    GetProjectList();
                }
                else if (res.data.Response == "Fail") {
                    alert("Error");
                }
              

            })
            .catch(function (err) {
                $scope.status_progress = false;
                alert(err.data.Message);
                
            });

        }

        $scope.Status_Clicked=function(status)
        {
            $scope.ProjectStatus = status.ProjectStatus;
        }

        

        $timeout(function () {
            GetProjectList("Open");

            $scope.ActivityList = [];

        }, 10);

        

        
        function GetProjectList(status)
        {
          
            if ($rootScope.Role === 'Admin') {

                projectService.getAllProject(status)
                     .then(function (data) {

                         $scope.ProjectList = data;
                         //alert(JSON.stringify(data[0]));
                         GetProjectExpense(data[0].ProjectID);
                     });
            }
            else if ($rootScope.Role === 'Manager') {

                projectService.getProjectForManager($rootScope.UserId, status)
                    .then(function (data) {
                      
                        $scope.ProjectList = data;
                        //alert(JSON.stringify(data[0]));
                        GetProjectExpense(data[0].ProjectID);
                        GetActivitiesForProject(data[0].ProjectID)
                    });

            }

            else if ($rootScope.Role === 'Employee') {

                projectService.getProjectForManager($rootScope.UserId, status)
                    .then(function (data) {

                        $scope.ProjectList = data;
                        //alert(JSON.stringify(data[0]));
                        GetProjectExpense(data[0].ProjectID);
                        GetActivitiesForProject(data[0].ProjectID)
                    });

            }
        }

        $scope.ShowExpense = function(id)
        {
            GetProjectExpense(id);
           // GetActivitiesForProject(id)
            }

        function GetProjectExpense(id)
        {
            $scope.projectdata = [];
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            // expenseItemService.getExpenseDataForProject(id)
            dailyExpenseService.getDailyExpenseForProject(id)
            .then(function (data) {
                console.log(JSON.stringify(data));
                $scope.expenseList = data;

                for (i = 0; i < data.length; i++) {
                    Expense.push(data[i].ExpenseAmount);
                    Received.push(data[i].ReceiveAmount);
                  
                    $scope.labels.push(new Date(data[i].ExpenseDate).getDate());
                    //var id = '#bar_' + i.toString();
                    //var ctx = $(id).get(0).getContext("2d");
                    //var myLineChart1 = new Chart(ctx).Line(data, line_chart_options);
                }
               
                $scope.projectdata = [Expense, Received];
                chartColors = ['#788299', '#db3e49'];
            });

         
        }

        



        function GetActivitiesForProject(pid)
        {
            $scope.item = {};
            activityService.GetActivitiesByProject(pid, "Open")
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.ActivityList = data;

            });
        }

        function SetexpenseOption() {
            $scope.expenseOptions = {
                margin: { top: 5, left: 5 },
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
                         key: "ExpenseAmount",
                         label: "Spent",
                         type: ["column"],
                         columnsHGap: 5,
                         color: "#79c7e0",
                         id: 'Series2'

                     },

                ],
                axes: {
                    x: {
                        key: "ExpenseDate",
                        type: "date"

                    }
                },
                columnsHGap: 5,
                columnVGap: 5

            };

        }

    });
 
})();