var Candoo = require('../lib/candoo');
var sinon = require('sinon');
var util = require('util');

describe('candoo', function() {

  describe('Candoo [constructor]', function() {
    var candoo = null;

    beforeEach(function() {
      candoo = new Candoo();
    });

    it('should contain all defined functions', function() {
      expect('_activityRegistry' in candoo).toEqual(true);
      expect('configureActivities' in candoo).toEqual(true);
      expect('do' in candoo).toEqual(true);
    });

    it('should define an empty object for the registry', function() {
      var length = Object.keys(candoo._activityRegistry).length;
      expect(length).toEqual(0);
    });

    it('should have a registry object with no prototype', function() {
      expect(candoo.prototype).toEqual(undefined);
    });

  });

  describe('configureActivities', function() {
    var candoo = null;

    beforeEach(function() {
      candoo = new Candoo();
    });

    it('should add a single activity to the registry', function() {
      var activity = {
        'view.profile': function(req, done) {}
      };

      candoo.configureActivities(activity);

      var length = Object.keys(candoo._activityRegistry).length;
      var act = candoo._activityRegistry['view.profile'];
      expect(length).toEqual(1);
      expect(act).toEqual(activity['view.profile']);
    });

    it('should add a multiple activities to the registry', function() {
      var activities = {
        'view.profile': function(req, done) {},
        'view.admin.page': function(req, done) {},
        'view.settings': function(req, done) {},
        'view.stats': function(req, done) {}
      };

      candoo.configureActivities(activities);

      var length = Object.keys(candoo._activityRegistry).length;
      var registry = candoo._activityRegistry;
      expect(length).toEqual(4);
      expect(registry['view.profile']).not.toEqual(undefined);
      expect(registry['view.admin.page']).not.toEqual(undefined);
      expect(registry['view.settings']).not.toEqual(undefined);
      expect(registry['view.stats']).not.toEqual(undefined);
    });

  });

  describe('do', function() {
    var candoo = null;

    beforeEach(function() {
      can = new Candoo();
    });

    it('should authorize a user for the view.profile activity', function() {
      var activity = {
        'view.profile': function(req, done) {
          done(req.user !== undefined);
        }
      };

      can.configureActivities(activity);

      var middleware = can.do('view.profile');
      var req = { user: {}, params: {} };
      var res = {};
      var spy = sinon.spy();

      middleware(req, res, spy);

      expect(spy.callCount).toEqual(1);
      expect(spy.firstCall.args).toEqual([]);
    });

    it('should reject a user that is not an admin for admin.view', function() {
      var rejectMessage = 'admins only';
      var activity = {
        'admin.view': function(req, done) {
          done(req.user.role === 'admin', rejectMessage);
        }
      };

      can.configureActivities(activity);

      var middleware = can.do('admin.view');
      var req = {
        user: {
          role: 'moderator'
        },
        params: {}
      };
      var res = {};
      var spy = sinon.spy();

      middleware(req, res, spy);

      var args = spy.firstCall.args;
      expect(spy.callCount).toEqual(1);
      expect(args[0]).not.toEqual(undefined);
      expect(args[0].message).toEqual(rejectMessage);
    });

    it('should call next with an error for unregistered activity', function() {
      var activityName = 'view.profile';
      var middleware = can.do(activityName);
      var req = {};
      var res = {};
      var next = sinon.spy();
      var expectedMessage = util.format(can._notRegisteredMessage, activityName);

      middleware(req, res, next);

      var args = next.firstCall.args;
      expect(next.callCount).toEqual(1);
      expect(args[0].message).toEqual(expectedMessage);
    });

  });

});
