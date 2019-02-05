(function () {
    'use strict'
    var app = angular.module('login', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

    app.config(function ($routeProvider) {
        $routeProvider
           .when('/', {
               templateUrl: 'Login/View/Home.html',
               controller: 'homeCtrl'
           })
            .when('/home', {
                templateUrl: 'Login/View/Home.html',
                controller: 'homeCtrl'
            })
             .when('/register', {
                 templateUrl: 'Login/View/Register.html',
                 controller: 'registerCtrl'
             })
            .when('/forgot', {
                templateUrl: 'Login/View/Recovery.html',
                controller: 'registerCtrl'
            })
            .when('/Aboutus', {
                templateUrl: 'Aboutus.html',
                controller: 'registerCtrl'
            })
          
        
           .otherwise({ redirectTo: '/home' });
    });
    
    //app.run(run);

    //run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    //function run($rootScope, $location, $cookies, $http) {
    //    // keep user logged in after page refresh
    //    $rootScope.globals = $cookies.getObject('globals') || {};
    //    if ($rootScope.globals.currentUser) {
    //        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    //    }

    //    $rootScope.$on('$locationChangeStart', function (event, next, current) {
           
    //        // redirect to login page if not logged in and trying to access a restricted page
    //        var restrictedPage = $.inArray($location.path(), ['/login', '/register','/request']) === -1;
    //        var loggedIn = $rootScope.globals.currentUser;
    //        if (restrictedPage && !loggedIn) {
    //            $location.path('/login');
    //        }
    //    });
    //}
})();