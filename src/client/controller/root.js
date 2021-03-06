'use strict';
// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$HUB', '$RPC', '$HUBService',
    function($rootScope, $scope, $stateParams, $state, $HUB, $RPC, $HUBService) {

        $rootScope.promise = $HUBService.wrap('user', 'get', {});

        $rootScope.promise.then(function(user) {
            $rootScope.user = user;
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {

            if(!($stateParams.user && $stateParams.repo)) {
                $scope.hook = {};
                $scope.onboard = {};
                return;
            }

            if(toParams.user !== fromParams.user || toParams.repo !== fromParams.repo) {
                $HUB.call('repos', 'get', {
                    user: $stateParams.user,
                    repo: $stateParams.repo
                }, function(err, repo) {
                    if(!err && repo.value.permissions.admin) {
                        $scope.hook = $RPC.call('webhook', 'get', {
                            user: $stateParams.user,
                            repo: $stateParams.repo
                        });
                    }
                });
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('error');
        });

        $scope.createWebhook = function() {
            $scope.creating = $RPC.call('webhook', 'create', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                user_uuid: $rootScope.user.value.id
            }, function(err, hook) {
                if(!err) {
                    $scope.hook = hook;
                    $scope.created = true;
                }
            });
        };

        $rootScope.dismiss = function(todismiss) {
            $RPC.call('user', 'dismiss', { dismiss: todismiss }, function(err, res) {
                if(!err) {
                    $rootScope.user.value.history[todismiss] = true;
                }
            });
        };
    }
]);
