var http = require('http');
var router = require('httpdispatcher');
var url = require('url');
var view = require('swig');

const PORT = 8080;

var server = http.createServer(handleRequest);
var htmlPath = 'resources/html/';

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
});

router.setStaticDirname(__dirname);
router.setStatic('resources');

router.onGet('/', function(req, res) {
    var v = view.renderFile(htmlPath+'index.html');

    handleQuery();
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(v);
});

router.onGet('/get', function(req, res) {
    var json = url.parse(req.url, true);
    var v = view.renderFile(htmlPath+'index.html', {
        pagename: 'awesome people',
        authors: ['Paul', 'Jim', 'Jane']
    });

    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(v);
    //res.write(JSON.stringify(json.query.name));
});

function handleRequest(request, response)
{
    try {
        console.log(request.url);
        router.dispatch(request, response);
        var body = "";

        request.on('data', function(data) {
            console.log("Partial body: "+data.toString());
            body += data;
        });

        request.on('end', function() {
            console.log(body.toString());
        });

    } catch (err) {
        console.log(err);
    }
}

