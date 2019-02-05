(function () {
    'use strict';

    var app = angular.module('login');

    app.controller('homeCtrl', function ($scope, $rootScope, $timeout) {

        $scope.ShowCarousel = true;

        $scope.SendQuery = function ()
        {
            alert("Mail to be integrated");
        }
    });

})();