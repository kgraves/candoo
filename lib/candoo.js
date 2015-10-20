/**
 * Candoo
 * minimal, activity based authorization Middleware for connect/express
 */

var util = require('util');

/**
 * Candoo constructor.
 *
 * Prepares all internal data structures and constant values.
 */
var Candoo = function() {
  // create activity registry
  this._activityRegistry = {};
  this._notRegisteredMessage = 'The activity (%s) is not registered';
  this._unauthorizedStatusCode = 401;
};

/**
 * Configure user defined activity handlers.
 *
 * @param {Object} config
 */
Candoo.prototype.configureActivities = function(config) {
  this._activityRegistry = config;
};

/**
 * Produces an express/connect middleware function for authorization.
 *
 * This function runs the function associated with the given `activity` to
 * authorize an action.
 *
 * @param {String} activity The name of an activity registered with Candoo.
 */
Candoo.prototype.do = function(activity) {
  var that = this;

  // return an express/connect middleware function
  return function(req, res, next) {

    // check the registry for the given activity
    if (that._activityRegistry[activity]) {

      // call handler function for the given `activity`.
      var handler = that._activityRegistry[activity];
      handler(req, function(isAuthorized, errorMessage, options) {
        if (isAuthorized) {
          next();
        } else {
          // if `onfailure` callback is passed, call that. Otherwise pass an
          // error to next.
          if (options && options.onFailure) {
            options.onFailure(req, res, next);
          } else {
            // create error with given `errorMessage` that has the unauthorized
            // http status code.
            var error = new Error(errorMessage);
            error.status = that._unauthorizedStatusCode;
            next(error);
          }
        }
      });

    } else {
      // activity is not registered, throw error with relevant message.
      var message = util.format(that._notRegisteredMessage, activity);
      next(new Error(message));
    }
  }
}

module.exports = Candoo;

