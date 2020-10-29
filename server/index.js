const express = require('express');
const cors = require('cors')
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwks = require('jwks-rsa');

app.use(cors())

var port = process.env.PORT || 4000;

var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-pkkepqar.eu.auth0.com/.well-known/jwks.json'
    }),
    audience: 'kruchuverchu.com',
    issuer: 'https://dev-pkkepqar.eu.auth0.com/',
    algorithms: ['RS256']
});

// This route doesn't need authentication
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// This route needs authentication
app.get('/api/private', jwtCheck, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

const checkScopes = jwtAuthz([ 'read:messages' ]);

app.get('/api/private-scoped', jwtCheck, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(port);