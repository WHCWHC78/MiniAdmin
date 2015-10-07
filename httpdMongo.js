var http = require('http');
var router = require('httpdispatcher');
var url = require('url');
var view = require('swig');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const PORT = 8080;

var server = http.createServer(handleRequest);
var htmlPath = 'resources/html/';
var mongoUrl = 'mongodb://localhost:27017/guest_book';

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
});

router.setStaticDirname(__dirname);
router.setStatic('resources');

router.onGet('/', function(req, res) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to DB server.");

        queryAll(db, function(array) {
            db.close();
            //console.log(array);

            var v = view.renderFile(htmlPath+'home.html', {guests: array});

            res.writeHead(200, {'Content-type': 'text/html'});
            res.end(v);
        });
    });
});

router.onPost('/insert', function(req, res) {
    var json = querystring.parse(req.body);
    
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to DB server.");

        db.collection('guests').insertOne(json, function(err, result) {
            assert.equal(null, err);
            console.log("Document is inserted");
            console.log(result);

            db.close();
        });
    });

    res.writeHead(200, {'Refresh' : '0; url=http://archie:8080/', 'Content-type': 'text/html'});
    res.end();

    var v = view.renderFile(htmlPath+'swig.html', {
        num: parseInt(json.num),
        range: makeRange(1, 12)
    });
});

function handleRequest(request, response)
{
    try {
        console.log("requested url: " + request.url);
        router.dispatch(request, response);
     } catch (err) {
        console.log(err);
    }
}

function makeRange(start, len)
{
    return (new Array(len)).join().split(',').map(function (n, idx) { return idx + start; });
}

var queryAll = function(db, callback) {
    var count = 0;
    var guests = [];
    var cursor = db.collection('guests').find();

    cursor.each(function(err, doc) {
        assert.equal(null, err);

        if (doc != null) 
            guests.push(doc);
        else 
            callback(guests);
    });
};

