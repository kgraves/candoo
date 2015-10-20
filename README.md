# candoo
A minimal activity based authorization middleware for connect/express

[![Build Status](https://travis-ci.org/kgraves/candoo.svg?branch=master)](https://travis-ci.org/kgraves/candoo)
[![Coverage Status](https://coveralls.io/repos/kgraves/candoo/badge.svg)](https://coveralls.io/r/kgraves/candoo)

This is heavily inspired by Derick Bailey's [mustbe](https://github.com/derickbailey/mustbe).

It makes no assumptions about how or where roles are stored or how you authorize
users. It does assume that all data needed to authorize actions will be in the 
request object. (e.g. user, roles, etc) This lets candoo play nice with
[Passport.js](https://github.com/jaredhanson/passport) and other authentication
libraries/frameworks.

### Usage
There are 3 quick steps to start using candoo.

1) install
```bash
npm install --save candoo
```

2) config
```javascript
var can = require('candoo');

can.configureActivities({

  'view.profile': function(req, done) {
    done(req.user !== undefined);
  },

  /**
   * You can pass a custom error message to the callback for a failure.
   */
  'view.admin.page': function(req, done) {
    if (req.user && req.user.role === 'admin') {
      done(true);
    } else {
      done(false, 'admins only!');
    }
  },

  /**
   * You can pass an options object for further functionality.
   *
   * The following options are supported:
   * {
   *   onFailure: function(req, res, next) {...}
   * }
   *
   * Currently the only option that is recognized is an `onFailure` callback.
   * This gives you more granular control when there is an unauthorized request.
   * For example, one may have the need to redirect unauthorized requests to 
   * different endpoints, instead of relying on error handlers further down the
   * line.
   */
  'view.stats': function(req, done) {
    if (req.user && req.user.isOwner(someModelObject)) {
      done(true);
    } else {
      done(false, '', { onFailure: helpers.redirectToLogin });
    }
  }

});
```

3) use
```javascript
var can = require('candoo');

app.get('/admin/page', can.do('view.admin.page'), function(req, res, next) {
  // serve admin page
});
```

### Contributing
Open an issue or send a pull request :)
