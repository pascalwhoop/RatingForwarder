//dependencies
var express = require('express');
var WebSocketServer = require('ws').Server;
var bodyParser = require('body-parser');


/* ########     app creationand configuration      ########*/
var app = express();
//to be able to extract the javascript object from the body of a request
app.use(bodyParser.json());


//to not exit everything if an error is thrown
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});


//initiate the websocket for our presentation laptop
wss = new WebSocketServer({port: 8888});
var presenterWS = null;
wss.on('connection', function (ws) {
    presenterWS = ws;
});

var sendToLaptop = function (type, data) {
    if(presenterWS){
        presenterWS.send({type: type, data: data});
    }
    else{
        console.log("WARNING: no presenter registered yet! no rating will be forwarded");
    }
}


//host our workshop application as well as its static content
app.use('/', express.static(__dirname + '/public/www'));



// ==================================================================
// every user in the workshop calls this once he calls the website
app.post('/api/user/:username', function (req, res) {
    sendToLaptop("register", {username: req.params.username});
    res.send("success");
});

// ==================================================================
// forward comments

app.post('/api/user/:username/comment', function (req, res) {
    sendToLaptop("comment", {username: req.params.username, comment: req.body});
    res.send("success");
});


// ==================================================================
// forward ratings
app.put('/api/user/:username/theory/:theory', function (req, res) {
    sendToLaptop("rating", {username: req.params.username, rating: req.params.theory});
    res.send({theory: req.params.theory});

});

// start the server and listen to the port supplied
var server = app.listen(8080, function () {
    console.log('Listening on port %d', server.address().port);
});




