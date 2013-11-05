var http = require('http');
var fs   = require('fs');
var path = require('path');

http.createServer(function (req, res) {
  var file = path.join(__dirname, req.url);

  // if (req.url.slice(-1) === '/') {
  //   file += 'indextester.html';
  // }
  // if (req.url.slice(-1) === '/') {
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
}).listen(8888);

console.log('Server running');
//use nodeFile to replace.