(function () {
    'use strict';

// Storing a single constant value
var app = angular.module('gas', []);

    app.constant('ConstRole', {
        ALL: '*',
        ADMIN:'Admin',
        MANAGER: 'Manager',
        EMPLOYEE: 'Employee'
    });


//app.constant('config', {
//    appName: 'xpen',
//    appVersion: 1.0,
//    apiUrl: 'http://www.xpen.online'
//});



}());