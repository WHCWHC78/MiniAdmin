var http = require('http');
var router = require('httpdispatcher');
var url = require('url');
var S = require('string');

const PORT = 8080;

var server = http.createServer(handleRequest);
var htmlPath = 'resources/html/';

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
});

router.setStaticDirname(__dirname);
router.setStatic('resources');

router.onGet('/', function(req, res) {
    var json = url.parse(req.url, true);

    res.writeHead(200, {'Content-type': 'text/html'});

    if (json.query.name)
        res.write("<html><h1>Hello, "+json.query.name+"!!</h1>");
    else
        res.write("<html><h1>Hello, World!!</h1>");

    res.write("<p> This is the response from your GET request. </p>");
    res.end("</html>");
});

router.onPost('/', function(req, res) {
    
    var str = req.body;
    var json = parseSecuredForm(str);

    res.writeHead(200, {'Content-type': 'text/html'});

    if (json.name)
        res.write("<html><h1>Hello, "+json.name+"!!</h1>");
    else
        res.write("<html><h1>Hello, World!!</h1>");

    res.write("<p> This is the response from your POST request. </p>");
    res.end("</html>");
});

function handleRequest(request, response)
{
    try {
        console.log(request.url);
        router.dispatch(request, response);
    }
    catch (err) {
        console.log(err);
    }
}

function parseSecuredForm(str)
{
    var json = {};

    for (var substr = S(str).between('"', '"').s; substr != ''; substr = S(str).between('"', '"').s) {
        json[substr] = S(str).between('\r\n\r\n', '\r\n').s;
        substr = json[substr];

        var pos = str.indexOf(substr);

        str = S(str).substr(pos).s
    }

    return json;
}


