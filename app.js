var app, env, express, morgan, request;

express = require('express');

app = express();

morgan = require('morgan');

request = require('request');

env = process.env.NODE_ENV || 'production';

if (env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan());
}

app.use('/', express["static"](__dirname + "/dist"));

app.all('/api/*', function(appRequest, appResponse) {
  var apiHost, apiPath, apiPort, apiRequestUrl;
  apiHost = process.env.API_HOST || 'http://54.152.133.36';
  apiPort = process.env.API_PORT || 3000;
  apiPath = appRequest.originalUrl.slice(4);
  apiRequestUrl = apiHost + ":" + apiPort + apiPath;
  return appRequest.pipe(request(apiRequestUrl)).pipe(appResponse);
});

app.get('/[^\.]+$', function(req, res) {
  return res.set('Content-Type', 'text/html').sendfile(__dirname + "/dist/index.html");
});

app.listen(process.env.PORT || 5000);
