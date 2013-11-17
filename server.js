var http = require('http');
var fs   = require('fs');
var path = require('path');
//require("path/to/twilio-node/lib");

// var twilio = require("library/twilio-node/lib");

// var AUTH_TOKEN = '4b1a7e2856fa7d9cf2852207e6890065';
// var ACCOUNT_SID = 'ACd245c613abcae75f62434e15433e450e';
// var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');


// // Your accountSid and authToken from twilio.com/user/account
// var accountSid = 'AC32a3c49700934481addd5ce1659f04d2';
// var authToken = "4b1a7e2856fa7d9cf2852207e6890065";
// var client = require('twilio')(accountSid, authToken);

// client.sms.messages.create({
//     body: "Jenny please?! I love you <3",
//     to: "+14242304955",
//     from: "+16466993812"
// }, function(err, message) {
//     process.stdout.write(message.sid);
// });


http.createServer(function (req, res) {
  var file = path.join(__dirname, req.url);

  if (req.url.slice(-1) === '/') {
    file += 'indextester.html';
  }
  // if (req.url.slice(-1) === '/') {
  //   file += 'doughnutexample.html';
  // }
  // if (req.url.slice(-1) === '/') {
  //   file += 'index.html';
  // }

  fs.exists(file, function (exists) {
    if (!exists) {
      res.statusCode = 404;
      return res.end();
    }

    return fs.createReadStream(file).pipe(res);
  });
}).listen(8888);

console.log('Server running');
//use nodeFile to replace.

http.createServer(function (req, res) {
  var file = path.join(__dirname, req.url);

  // if (req.url.slice(-1) === '/') {
  //   file += 'indextester.html';
  // }
  // // if (req.url.slice(-1) === '/') {
  //   file += 'doughnutexample.html';
  // }
  if (req.url.slice(-1) === '/') {
    file += 'index.html';
  }

  fs.exists(file, function (exists) {
    if (!exists) {
      res.statusCode = 404;
      return res.end();
    }

    return fs.createReadStream(file).pipe(res);
  });
}).listen(8000);

console.log('Server running');
//use nodeFile to replace.