var http = require('http');

var PORT = 8080;

function jsonResponse(response, data) {
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(data));
  response.end();
}

function jsonHeaderPropResponse(response, headers, headerProp) {
    var prop = headers[headerProp];
    if (prop === undefined) {
        return notFoundResponse(response, 'Property ' + headerProp +
        ' does not exist in this header');
    }
    return jsonResponse(response, prop);
}

function notFoundResponse(response, msg) {
    if (!msg) {
        msg = 'Not found';
    }
    response.statusCode = 404;
    response.write('404: ' + msg);
    response.end();
}

var server = http.createServer(function(request, response) {
    var pathParams = request.url.split('/');
    var keyPath = pathParams[1];
    console.log('path params: ', pathParams);

    if (keyPath === 'headers') {
        var headers = request.headers;
        var headerProp = pathParams[2];
        if (headerProp) {
            return jsonHeaderPropResponse(response, headers, headerProp);
        }
        return jsonResponse(response, headers);
    }

    if (keyPath === 'version') {
        return jsonResponse(response, request.httpVersion);
    }

    return notFoundResponse(response);
});

console.log('Server listening on port ' + PORT);
server.listen(PORT);
