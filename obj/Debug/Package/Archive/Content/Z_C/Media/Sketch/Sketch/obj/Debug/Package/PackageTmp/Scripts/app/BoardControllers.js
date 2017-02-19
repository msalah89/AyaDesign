 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('Board');

    angular.module('Board',['ngRoute'])
    .controller('Board_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/Board/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Board_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/Board/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Board_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
                $http.get('/Api/AspNetUser/')
        .then(function(response){$scope.Instructor_options = response.data;});
        
        $scope.save = function(){
            $http.post('/Api/Board/', $scope.data)
            .then(function(response){ $location.path("Board"); });
        }

    }])
    .controller('Board_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Board/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

                $http.get('/Api/AspNetUser/')
        .then(function(response){$scope.Instructor_options = response.data;});
        
        $scope.save = function(){
            $http.put('/Api/Board/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Board"); });
        }

    }])
    .controller('Board_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Board/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/Board/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Board"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/Board', {
                title: 'Board - List',
                templateUrl: '/Static/Board_List',
                controller: 'Board_list'
            })
            .when('/Board/Create', {
                title: 'Board - Create',
                templateUrl: '/Static/Board_Edit',
                controller: 'Board_create'
            })
            .when('/Board/Edit/:id', {
                title: 'Board - Edit',
                templateUrl: '/Static/Board_Edit',
                controller: 'Board_edit'
            })
            .when('/Board/Delete/:id', {
                title: 'Board - Delete',
                templateUrl: '/Static/Board_Delete',
                controller: 'Board_delete'
            })
            .when('/Board/:id', {
                title: 'Board - Details',
                templateUrl: '/Static/Board_Details',
                controller: 'Board_details'
            })
    }])
;

})();
