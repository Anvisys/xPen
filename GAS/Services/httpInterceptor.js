
(function () {
    'use strict';
    var app = angular.module('gas')
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('APIInterceptor');
    }]);

    app.service('APIInterceptor', [function () {
        var service = this;

        service.request = function (config) {
            var UserObj = JSON.parse(localStorage.users);
            config.headers.token = UserObj.UserToken;
            return config;
        };
    }]);

    app.service('LoginCheck', [function () {
        var service = this;

        service.request = function (config) {
            var UserObj = JSON.parse(localStorage.users);
            alert(1);
            if (typeof localStorage.users === 'undefined') {
                alert('Session Out');
            }

            return config;
        };
    }]);

}());


