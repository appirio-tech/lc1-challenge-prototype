// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  //res.send('Hello World!');
res.sendfile('index.html');
});

app.use(express.static(__dirname + '/public'));

console.log("Listening on " + process.env.PORT);

var port = Number(process.env.PORT || 5051);
//var port = Number(5051);
app.listen(port, function() {
  console.log("Listening on " + port);
});
