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

    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

//app.constant('config', {
//    appName: 'xpen',
//    appVersion: 1.0,
//    apiUrl: 'http://www.xpen.online'
//});



}());