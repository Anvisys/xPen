(function () {

    var app = angular.module('gas');

    app.controller('activityCtrl', function (activityService,expenseItemService, projectService,userService,Excel, $timeout, $scope, $rootScope, $routeParams, $cookies) {
        //$scope.Status = { 'Show All': '!!', 'Initiated': 'Initiated', 'Added': 'Added', 'Submitted': 'Submitted', 'Paid': 'Paid' };
        $scope.Status = [ 'Show All', 'Open', 'Closed'];
        $scope.filterStatus = 'Open';
        $scope.newActivity_progress = false;
        $scope.QuickExpense_progress = false;
        var contentHeight = window.innerHeight - 250;
        $scope.ScreenHeight = contentHeight + "px";
        var row1 = 0.5 * contentHeight;
     
        $scope.row1Height = row1 + "px";

        if (typeof $routeParams.id != 'undefined') {
           // alert($routeParams.id);
            $scope.ProjectName = $routeParams.id;
            $scope.filterStatus = 'Show All';
        }
        else {
           // alert(2);
            $scope.ProjectName = "";
            $scope.filterStatus = 'Open';
        }
    
     
    
        $scope.activityList = [];
        $scope.ProjectList = [];
        $scope.NewActivityForm = false;
        $scope.QuickExpenseForm = false;
        $scope.selectedUserID = $rootScope.UserId;
       // alert($rootScope.UserId);
        $scope.Employee = $rootScope.UserId + "(" + $rootScope.UserName + ")";

        $scope.Event = function (SelectedAction) {
            alert(SelectedAction);
        }

        $scope.ShowData = function () {

            GetActivitieData();
        }

        $scope.Cancel = function()
        {
            $scope.NewActivityForm = false;
            $scope.QuickExpenseForm = false;
            
        }

        $scope.ShowNewActivityForm = function ()
        {
            $scope.Employee = $rootScope.UserId + "(" + $rootScope.UserName + ")";
            $scope.ActivityType = "Detail";
            $scope.SelectProjectForm = true;
            }

        $scope.AddActivity = function () {
            $scope.newActivity_progress = true;
            var date = new Date();
            var Activity = {
                ActivityName: $scope.activity_name, EmployeeID: $scope.selectedUserID,
                ProjectID: $scope.activity_Project.ProjectID, CreatedBy: $rootScope.UserId, 
                ActivityDescription: $scope.activity_remarks, CreationDate: date, ExpenseAmount: 0,
                ActivityStatus: "Initiated", OrgID: $rootScope.OrgID, ApproverID: $scope.activity_Project.CreatedBy
            };
           console.log(JSON.stringify(Activity));
           
            activityService.CreateActivity(Activity)
            .then(function (resp) {
                $scope.newActivity_progress = false;
                if(resp.data.Response == "OK")
                {
                    $scope.NewActivityForm = false;
                    GetActivitieData();
                }
                else
                {
                    alert("Error");
                }

            });
        }


        $scope.ShowQuickExpenseForm = function () {

            $scope.Employee = $rootScope.UserId + "(" + $rootScope.UserName + ")";
      
            $scope.ActivityType = "Quick";
            $scope.SelectProjectForm = true;

        }
        $scope.CancelProjectWindow = function () {
        
            $scope.SelectProjectForm = false;
        }

        $scope.AddQuickExpense = function () {
           // alert($scope.selectedUserID);
            $scope.QuickExpense_progress = true;
            var date = new Date();
            var Activity = {
                ActivityName: $scope.expense_name, EmployeeID: $scope.selectedUserID,
                ProjectID: $scope.activity_Project.ProjectID, CreatedBy: $rootScope.UserId,
                ActivityDescription: $scope.expense_remarks, CreationDate: date, ExpenseAmount: $scope.expense_amount,
                ActivityStatus: "Quick", OrgID: $rootScope.OrgID, ApproverID: $scope.activity_Project.CreatedBy
            };

            activityService.CreateActivity(Activity)
            .then(function (resp) {
                $scope.QuickExpense_progress = false;
                if (resp.data.Response == "OK") {
                    $scope.QuickExpenseForm = false;
                    GetActivitieData();
                }
                else {
                    alert("Error");
                }

            });

        }

        $scope.OpenEmployeeDialog = function () {
            $scope.SelectUserForm = true;
            userService.GetAll()
            .then(function (data) {
                //alert(JSON.stringify(data));
                $scope.UserList = data;
            });
        }

        $scope.CancelUserWindow = function () {
            $scope.SelectUserForm = false;
        }

        $scope.Select = function (user) {
            $scope.Employee = user.UserId + "(" + user.UserName + ")";
            $scope.selectedUserID = user.UserId;
            $scope.SelectUserForm = false;
        }

        $scope.SelectProject = function(proj)
        {
            $scope.activity_Project = proj;
            if ($scope.ActivityType == "Quick") {
                $scope.activity_name = "";
                $scope.activity_remarks = "";

                $scope.SelectProjectForm = false;
                $scope.QuickExpenseForm = true;
            }
            else if ($scope.ActivityType == "Detail") {
                $scope.SelectProjectForm = false;
                $scope.expense_remarks = "";
                $scope.expense_name = "";
                $scope.expense_amount = "";
                $scope.NewActivityForm = true;
            }
        }

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
         
            var name = "Activities_" + $rootScope.UserId;

            $scope.exportHref = Excel.tableToExcel(tableId, name);

            $timeout(function () { location.href = $scope.exportHref; }, 100); // trigger download

        }





        $timeout(function () {
           
            GetActivitieData();

            projectService.getAllProject("Open")
               .then(function (data) {

                   $scope.ProjectList = data;
               });
           
        }, 10);


        function GetActivitieData()
        {
            activityService.GetActivitiesByEmployee($rootScope.UserId, $scope.filterStatus)
                     .then(function (data) {
                         $scope.activityList = data.$values;

                         GetExpenseData(data.$values[0].ActivityID);
                     });
            
           
        }

        function GetProjectList() {
            alert($rootScope.UserId);
            if ($rootScope.Role === 'Admin') {

                projectService.getAllProject("Open")
                     .then(function (data) {

                         $scope.ProjectList = data;
                     });
            }
            else if ($rootScope.Role === 'Manager') {

                projectService.getProjectForManager($rootScope.UserId,"Open")
                    .then(function (data) {
                      //  alert(data);
                        $scope.ProjectList = data;
                    });

            }
            else if ($rootScope.Role === 'Employee') {

                projectService.getAllProject("Open")
           .then(function (data) {

               $scope.ProjectList = data;

           });

            }
        }

        $scope.ShowExpense=function(activityID)
        {
            GetExpenseData(activityID);
            
        }

        function GetExpenseData(ID)
        {
           
            var Expense = [];
            var Received = [];
            $scope.labels = [];
            expenseItemService.getExpenseDataForActivity(ID).
               then(function (data) {
                   

                   $scope.expenseList = data;

                   for (i = 0; i < data.length; i++) {

                       Expense.push(data[i].ExpenseAmount);
                       Received.push(data[i].ReceiveAmount);
                       $scope.labels.push(new Date(data[i].ExpenseDate).getDate());
                   }

                   $scope.expenseData = [Expense, Received];
                   $scope.chartColors = ['#788299', '#db3e49'];

               });
        }

    });

}());