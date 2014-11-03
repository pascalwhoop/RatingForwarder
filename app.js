//dependencies
var express = require('express');
var hueControl = require('./local_modules/hueControl.js');
var ratingLogger = require('./local_modules/ratingHistory.js');
var loggingStatistics = require('./local_modules/loggingStatistics.js');
var bodyParser = require('body-parser')


/* ########     app creationand configuration      ########*/
var app = express();
//to be able to extract the javascript object from the body of a request
app.use(bodyParser.json());


//to not exit everything if an error is thrown
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});


//host our workshop application as well as its static content
app.use('/', express.static(__dirname + '/public/www'));

var userRequests = {};


// ==================================================================
//every user in the workshop calls this once he calls the website
app.post('/api/user/:username', function (req, res) {
    var username = req.params.username;


    //if user does not yet exist add him
    if (!userRequests[username]) {
        console.log("user " + username + " joined the workshop");
        userRequests[username] = {
            speed: 0,
            theory: 0
        }
    }
    res.send(userRequests[username]);
});

// ==================================================================
// user custom textual response

app.post('/api/user/:username/comment', function (req, res) {
    var username = req.params.username;
    var comment = req.body;
    ratingLogger.logUserComment(username, comment.text);
    console.log("user comment received");
    res.send("success");
});


// ==================================================================
// our API for controlling the lights. we take the user requests here

app.put('/api/user/:username/speed/:speed', function (req, res) {
    var username = req.params.username;
    var speed = parseInt(req.params.speed);

    console.log("user " + username + " wants speed " + speed);
    if (speed == 1 || speed == 0 || speed == -1) {


        userRequests[username].speed = speed;
        res.send(userRequests[username]);

        var hue = hueControl.calcSpeedColor(userRequests);
        var sat = hueControl.calcSaturation(userRequests, "speed");
        hueControl.setSpeedColor(hue, sat);

        //for later evaluation purposes
        ratingLogger.logRating(userRequests, username, "speed", speed, {hue: hue, sat: sat});
    } else {
        res.send("Error, wrong values submitted");
    }

});



app.put('/api/user/:username/theory/:theory', function (req, res) {
    var username = req.params.username;
    var theory = parseInt(req.params.theory);

    console.log("user " + username + " wants theory " + theory);

    if (theory == 1 || theory == 0 || theory == -1) {

        userRequests[username].theory = theory;
        res.send(userRequests[username]);

        var hue = hueControl.calcTheoryColor(userRequests);
        var sat = hueControl.calcSaturation(userRequests, "theory");
        hueControl.setTheoryColor(hue, sat);

        //for later evaluation purposes
        ratingLogger.logRating(userRequests, username, "theory", theory, {hue: hue, sat: sat});
    } else {
        res.send("Error, wrong values submitted");
    }
});




// start the server and listen to the port supplied
var server = app.listen(8080, function () {
    console.log('Listening on port %d', server.address().port);
});




