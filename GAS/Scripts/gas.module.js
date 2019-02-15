(function () {
    'use strict';

    var app = angular.module('gas', ["ngRoute", "ngCookies", "ngAnimate", "n3-line-chart", "chart.js", "ngImgCrop", "ui.bootstrap"]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'GAS/View/Activity.html',
                controller: 'activityCtrl'
            })
        .when("/main", {
            templateUrl: "GAS/View/main.html",
            controller: "mainCtrl"
        })

        .when("/user", {
            templateUrl: "GAS/View/User.html",
            controller: "userCtrl"

        })
       .when("/project", {
           templateUrl: "GAS/View/project.html?i=1",
           controller: "projectCtrl"

       })
         .when("/activity", {
             templateUrl: "GAS/View/Activity.html",
             controller: "activityCtrl"

         })
        .when("/transaction", {
            templateUrl: "GAS/View/Transaction.html",
            controller: "transactionCtrl"

        })
        .when("/accounts", {
            templateUrl: "GAS/View/Account.html",
            controller: "accountCtrl"

        })
         .when("/approval", {
             templateUrl: "GAS/View/Approval.html",
             controller: "approvalCtrl"

         })
         .when('/Show/:id', {
             templateUrl: 'GAS/View/ExpenseItem.html?k=1',
             controller: 'expenseItemCtrl'

         })
        .when("/activity/:id", {
            templateUrl: "GAS/View/Activity.html",
            controller: "activityCtrl"

        })
             .when("/PrjDetail/:id", {
                 templateUrl: "GAS/View/ProjectDetail.html",
                 controller: "projectDetailCtrl"

             })
        .when("/Transaction/:id", {
            templateUrl: "GAS/View/Transaction.html",
            controller: "transactionCtrl"

        })
        .when("/expense", {
            templateUrl: 'GAS/View/Expense.html',
            controller: 'expenseCtrl'
        })
        .when("/Profile", {
            templateUrl: 'GAS/View/Profile.html',
            controller: 'profileCtrl'
        })
            .when("/request", {
                templateUrl: 'GAS/View/Requests.html',
                controller: 'requestCtrl'
            })

            .when("/tax", {
                templateUrl: 'GAS/View/Tax.html',
                controller: 'taxCtrl'
            })
            .when("/UserTrans/:id", {
                templateUrl: 'GAS/View/UserTransaction.html',
                controller: 'userTransactionCtrl'
            })
            .when("/employedashboard", {
                templateUrl: 'GAS/View/employedashboard.html',
                controller: 'dashboardCtrl'
            })
            .when("/managerdashboard", {
                templateUrl: 'GAS/View/managerdashboard.html',
                controller: 'dashboardCtrl'
            })
        .otherwise({ redirectTo: '/activity' });
    });

    
    
    app.factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId),
                    ctx = { worksheet: worksheetName, table: table.html() },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    })


    //app.directive('textLength', function () {
    //    return {
    //        require: 'ngModel',
    //        link: function (scope, element, attr, mCtrl) {
    //            function myValidation(value) {
    //                if (value.length > 5) {
    //                    mCtrl.$setValidity('charE', true);
    //                } else {
    //                    mCtrl.$setValidity('charE', false);
    //                }
    //                return value;
    //            }
    //            mCtrl.$parsers.push(myValidation);
    //        }
    //    };

    //});


    app.directive('minAmount', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function myValidation(value) {
                    if (value > 100) {
                        mCtrl.$setValidity('charE', true);
                    } else {
                        mCtrl.$setValidity('charE', false);
                    }
                    return value;
                }
                mCtrl.$parsers.push(myValidation);
            }
        };

    });


    //app.directive('datePicker', function () {
    //    return {
    //        restrict: 'A',
    //        require: 'ngModel',
    //        link: function (scope, element, attrs, mCtrl) {
    //            $(function () {
    //                $(element).datepicker({
    //                    dateFormat: 'yy-mm-dd',
    //                    onSelect: function (date) {
    //                        mCtrl.$setViewValue(date);
    //                        scope.$apply();

    //                    }
    //                });
    //            });
    //        }
    //    }
    //});


})();