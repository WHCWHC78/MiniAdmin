var http = require('http');
var router = require('httpdispatcher');
var url = require('url');
var querystring = require('querystring');

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

    res.write('<form action="/" method="POST">'+
                '<input name="name" type="text" />'+
                '<input value="Go!!!" type="submit" />'+
            '</form>');
    res.end("</html>");
});

router.onPost('/', function(req, res) {
    
    var json = querystring.parse(req.body);

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

