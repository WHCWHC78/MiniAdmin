var http = require('http');
var router = require('httpdispatcher');
var url = require('url');
var view = require('swig');
var mongodb = require('mongodb').MongoClient;
var assert = require('assert');

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
    //res.write(v);
    res.write(JSON.stringify(json.query.name));
    res.end("fuck");
});

router.onPost('/insert', function(req, res) {
    var json = url.parse(req.url, true);
    var body = "";
    
    
    console.log(req.method);
    //handleInsert(json.query.name, json.query.msg);
    //req.on('end', function() {
        res.writeHead(200, {'Content-type': 'text/html'});
        //res.write(JSON.stringify(json.query.name));
        //res.write(JSON.stringify(json.query.msg));
        res.end("hey");
    //});
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

function handleInsert(name, msg)
{
    mongodb.connect('mongodb://localhost:27017/guest_book', function(err, db) {
        assert.equal(null, err);
        insert(name, msg, db, function() {
            db.close();
        });
    });
}

function handleQuery()
{
    mongodb.connect('mongodb://localhost:27017/guest_book', function(err, db) {
        assert.equal(null, err);
        query(db, function() {
            db.close();
        })
    });
}


function insert(name, msg, db, callback)
{
    db.collection('guests').insertOne({"name": ""+JSON.stringify(name), "msg": ""+JSON.stringify(msg)}, function(err, result) {
        assert.equal(null, err);
        console.log("Inserted a document into guests collection.");
        callback(result);
    });
}

function query(db, callback)
{
    var cursor = db.collection('guests').find();

    cursor.each(function(err, doc) {
        assert.equal(null, err);
        if (doc != null)  console.log(doc);
        else callback();
    });
}
