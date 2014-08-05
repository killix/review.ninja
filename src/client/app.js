module = angular.module('app', ['ui.router', 'ui.bootstrap', 'ninja.filters', 'ninja.config', 'frapontillo.bootstrap-switch', 'angulartics', 'angulartics.google.analytics']);

filters = angular.module('ninja.filters', []);

// *************************************************************
// Delay start 
// *************************************************************

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

// *************************************************************
// States
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $analyticsProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'HomeCtrl'
            })
            .state('repo', {
                url: '/:user/:repo',
                templateUrl: '/templates/repo.html',
                controller: 'RepoCtrl',
                resolve: {
                    repo: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('repos', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo
                            });
                        }
                    ]
                }
            })
            .state('pull', {
                url: '/:user/:repo/pull/:number',
                templateUrl: '/templates/pull.html',
                controller: 'PullCtrl',
                resolve: {
                    repo: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('repos', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo
                            });
                        }
                    ],
                    pull: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('pullRequests', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                number: $stateParams.number
                            });
                        }
                    ]
                }
            })
            .state('issue', {
                url: '/:user/:repo/pull/:number/:issue',
                templateUrl: '/templates/issue.html',
                controller: 'IssueCtrl',
                resolve: {
                    repo: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('repos', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo
                            });
                        }
                    ],
                    pull: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('pullRequests', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                number: $stateParams.number
                            });
                        }
                    ],
                    issue: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('issues', 'getRepoIssue', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                number: $stateParams.issue
                            });
                        }
                    ]
                }
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

        $analyticsProvider.withAutoBase(true); /* Records full path */

    }
])
    .run(['$config',
        function($config) {
            $config.get(function(data, status) {
                if (data.gacode) {
                    ga('create', data.gacode, 'auto');
                }
            });
        }
    ]);
