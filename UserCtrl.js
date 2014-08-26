/**
 * User Module.
 * Inherits MainCtrl Scope.
 */
angular.module('app')
    .controller('UserCtrl', ['$scope', '$q',
        function($scope, $q) {
            /**
             * Configuration
             * @type {String}
             */
            $scope = $scope.init({
                route: 'users',
                model: 'User',
                templates: 'templates/user/',
                labels: {
                    plural: 'Users',
                    singular: 'User'
                },
                fields: [
                    {field: 'username', label: 'Username', display: true},
                    {field: 'email', label: 'Email', display: true},
                    {field: 'displayName', label: 'Name', display: true},
                    {field: 'roleList', label: 'Roles', display: false}
                ]
            });
            
            /**
             * Custom Functions for this Controller
             * @type {[type]}
             */
            $scope.record.roles = [];

            $scope.hasRole = function(role) {
                return $scope.record.roles && $scope.record.roles.indexOf(role) !== -1;
            };

            $scope.toggleRole = function(role) {
                var index = $scope.record.roles.indexOf(role);
                if (index !== -1) {
                    $scope.record.roles.splice(index, 1);
                } else {
                    $scope.record.roles.push(role);
                }
            };
            
            $scope.record.banks = [];

            $scope.addBank = function(){
                if(!$scope.record.banks) $scope.record.banks = [];
                $scope.record.banks.push({});
            };

            $scope.removeBank = function(index){
               $scope.record.banks.splice(index, 1);  
            };
        }
    ]);
