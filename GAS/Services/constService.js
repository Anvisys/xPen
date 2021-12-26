(function () {
    'use strict';

    angular
        .module('gas')
        .factory('constService', constService);
    constService.$inject = ['$http', '$filter', '$rootScope'];

    function constService($http, $filter, $rootScope) {

        var service = {};
        service.ImageRootDirectory = ImageRootDirectory;
        return service;

        function ImageRootDirectory() {
            return "http://www.kevintech.in/Images";
            //return AccList;
        }

    }

}());
