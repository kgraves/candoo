/**
 * Candoo
 * minimal, activity based authorization Middleware for connect/express
 */

var util = require('util');

var Candoo = function() {
  // create activity registry
  this._activityRegistry = {};
  this._notRegisteredMessage = 'The activity (%s) is not registered';
};

// configure user defined activity handlers
/**
 *
 */
Candoo.prototype.configureActivities = function(config) {
  this._activityRegistry = config;
};

/**
 *
 */
Candoo.prototype.do = function(activity) {
  var that = this;

  // return an express/connect middleware function
  return function(req, res, next) {

    // check the registry for the given activity
    if (that._activityRegistry[activity]) {

      // call handler and return result
      var handler = that._activityRegistry[activity];
      handler(req, function(isAuthorized, errorMessage) {
        if (isAuthorized) {
          next();
        } else {
          next(new Error(errorMessage));
        }
      });

    } else {
      // activity is not registered, throw error with relevant message
      var message = util.format(that._notRegisteredMessage, activity);
      next(new Error(message));
    }
  }
}

module.exports = Candoo;

