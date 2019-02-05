(function () {
    'use strict';

    var app = angular.module('login');

    app.controller('CarouselCtrl', function ($scope, $rootScope, $timeout) {
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        var slides = $scope.slides = [
            {image: 'Login/Images/banner_9.jpg',id:1,title:"Mobile Data Entry",text:"Android and Web Interface to record data anytime anywhere"},
            { image: 'Login/Images/banner9.jpg', id: 2, title: "Data Anlysis Tools", text: "Grouping data for Accounts, Project and Activities for easy Analysis" },
            { image: 'Login/Images/bright_banner5.png', id: 3, title: "Reporting", text: "Approval, payment and reporting tools" }];

     });

})();