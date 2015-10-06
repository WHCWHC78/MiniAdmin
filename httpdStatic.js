var http = require('http');
var router = require('httpdispatcher');

const PORT = 8080;

var server = http.createServer(handleRequest);

router.setStaticDirname(__dirname);
router.setStatic('resources');

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
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

