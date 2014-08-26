/**
 * Main Ctrl.
 * Is inherited by all other Controllers. Overwrite thingers if necessary.
 */
angular.module('app')
    .controller('MainCtrl', ['$scope', '$location', 'uiService', 'userService', 'metaService', 'modalService', '$sailsSocket',
    	function($scope, $location, uiService, userService, metaService, modalService, $sailsSocket){
            /**
             * Defaults!
             * @type {Object}
             */
            $scope.config = {
                route: '',
                model: '',
                templates: '',
                labels: {
                    plural: '',
                    singular: ''
                },
                fields: []
            };

            $scope.list = [];
            $scope.record = {};

            $scope.search = uiService.search;

            $scope.select =  uiService.select;

            $scope.alerts = uiService.alerts;

            $scope.meta = metaService;

            $scope.me = userService.me;

            $scope.permissions = userService.permissions;

            $scope.init = function(config){
                angular.extend($scope.config, config);
                $scope.search.fields.available  = angular.copy($scope.config.fields);
                $scope.search.fields.state = angular.copy($scope.config.fields);
                $scope.search.fields.toggle();
                $scope.getList();
                $scope.subscribe();
                return $scope;
            };
            /**
             * Create Record
             * @return {[type]} [description]
             */
            $scope.create = function() {
                modalService.create($scope);
            };

            /**
             * Update Record
             * @return {[type]} [description]
             */
            $scope.update = function(id) {
                modalService.update($scope, id);
            };

            /**
             * Destroy Record
             * @param  {string} id MongoID String
             * @return {[type]}    [description]
             */
            $scope.destroy = function(id) {
                modalService.destroy($scope, id);
            };

            /**
             * Search or List Records.
             * @return {[type]} [description]
             */
            $scope.getList = function() {
                /**
                 * Update URL Bar with Search Params from Controller Scope.
                 */
                angular.forEach($scope.search.params, function(value, key){
                    $location.search(key, value ? value : null);
                });
                /**
                 * Search!
                 */
                
                var args = { data  : { args: $scope.search.params, limit: $scope.search.limit, page: $scope.search.page } };
                console.log('Search Args', args);
                $sailsSocket.get('/api/' + $scope.config.route, args)
                    .success( function(data) {
                        if(data.length > 0){
                            $scope.search.fields.data = [];
                            angular.forEach(data[0], function(value, field){
                                $scope.search.fields.data.push(field);
                            });
                        }
                        $scope.search.fields.toggle();
                        $scope.list = data;
                        console.log('Search Results', data);
                    })
                    .error( function(err){
                        uiService.addAlert( { msg: err, type: 'danger' } );
                    });

            };
            
            /**
             * Subscribe user to route channel;
             * @return {[type]} [description]
             */
            $scope.subscribe = function(){
                /**
                 * Listen for updates to this Model.
                 * @param  {[type]} data [description]
                 * @return {[type]}      [description]
                 */
                $sailsSocket.subscribe($scope.config.model.toLowerCase(), function(msg) {
                    $scope.getList();
                });
            };

            $scope.interface = {};
            
    	}
    ]);