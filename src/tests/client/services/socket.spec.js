'use strict';
// settings test
describe('Socket Factory', function() {

    var scope, repo, httpBackend, socket, cb;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        scope = $rootScope.$new();

        socket = $injector.get('socket');

        cbOn = function(socket, args) {
            scope.received = true;
        };

        cbEmit = function(socket, args) {
            scope.emitted = true;
        };
    }));

    // should listen successfully for events
    it('should listen for events', function() {
        socket.on('thing', cb);
        socket.emit('thing', {}, cbEmit);
        scope.$digest();
    });

    // should emit thing upon event
    it('should emit something when an event happens', function() {
        socket.emit('stuff', {}, cbOn);
        scope.$digest();
    });

});