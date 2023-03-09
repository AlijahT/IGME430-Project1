const http = require('http');
const query = require('querystring');
const url = require('url');
const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', () => {
    //console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const POSTHandler = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addBuild') {
    parseBody(request, response, jsonHandler.addBuild);
  }
};

const GETHandler = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedURL.pathname === '/getBuild') {
    jsonHandler.getBuild(request, response);
  } else if (parsedURL.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedURL.pathname === '/blasters.json') {
    htmlHandler.getBlaster(request, response);
  } else {
    jsonHandler.notReal(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (request.method === 'POST') {
    POSTHandler(request, response, parsedURL);
  } else {
    GETHandler(request, response, parsedURL);
  }
};

http.createServer(onRequest).listen(port, () => {
  //console.log(`Listening on 127.0.0.1:${port}`);
});
