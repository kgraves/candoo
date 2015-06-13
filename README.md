# candoo
A minimal activity based authorization middleware for connect/express

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

  // you can pass a custom error message to the callback for a failure
  'view.admin.page': function(req, done) {
    if (req.user && req.user.role === 'admin') {
      done(true);
    } else {
      done(false, 'admins only!');
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
