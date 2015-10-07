var http = require('http');
var router = require('httpdispatcher');
var url = require('url');
var view = require('swig');
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
    var v = view.renderFile(htmlPath+'form.html');

    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(v);
});

router.onPost('/', function(req, res) {
    var json = querystring.parse(req.body);
    var v = view.renderFile(htmlPath+'swig.html', {
        num: parseInt(json.num),
        range: makeRange(1, 12)
    });

    console.dir(json);
    console.log(typeof(json.num));

    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(v);
});

function handleRequest(request, response)
{
    try {
        console.log(request.url);
        router.dispatch(request, response);
     } catch (err) {
        console.log(err);
    }
}

function makeRange(start, len)
{
    return (new Array(len)).join().split(',').map(function (n, idx) { return idx + start; });
}
