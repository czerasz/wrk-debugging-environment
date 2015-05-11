// The application returns log messages which are useful for HTTP debugging
// 
// Example output:
// [2015-05-06 10:12:10] Request 2
// 
// POST/1.1 /test-path?test=value on :::3000
// 
// Headers:
//  - user-agent: curl/7.38.0
//  - accept: */*
//  - cookie: USER_TOKEN=Yes
//  - host: czerasz.com
//  - content-length: 9
//  - content-type: application/x-www-form-urlencoded
// 
// Cookies:
//  - USER_TOKEN: Yes
// 
// Body:
// some data


var express      = require('express');
var cookieParser = require('cookie-parser');

// Initialize the express framework and the cookieParser middleware
var app = express();
    app.use(cookieParser());

// Initialize the request counter which will count the number of requests
var request_counter = 0;

// Create a method which returns the current date in a log format
// 
// Resource: http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
var currentDateString = function (date){
    function pad(n){
      return n<10 ? '0'+n : n
    };

    var date = new Date();

    return date.getUTCFullYear()+'-'
           + pad(date.getUTCMonth()+1)+'-'
           + pad(date.getUTCDate())+' '
           + pad(date.getUTCHours())+':'
           + pad(date.getUTCMinutes())+':'
           + pad(date.getUTCSeconds());
}

// Handle all methods and all paths
app.all('*', function (req, res) {
  // Initialize a variable for the request body - used in POST requests
  var body = '';

  // Collect the body from the request
  req.on('data', function(chunk) {
    body += chunk;
  });

  // Called when all body chunks were collected
  req.on('end', function(){
    // Increase the request counter to identify incomming requests
    request_counter++;

    console.log("\n"+'--- --- --- --- --- --- --- --- --- --- --- --- ---'+"\n");
    console.log('['+ currentDateString() +'] Request '+ request_counter +"\n");
    // console.log(req);

    // Print out basic request information
    // Example: POST/1.1 /test-path?test=value on :::3000
    console.log( req.method +'/'+ req.httpVersion +' '+ req.originalUrl +' on '+ server.address().address +':'+ server.address().port);

    // Check if HTTP headers are available
    if ( Object.keys(req.headers).length > 0 ) {
      // Print all available headers
      console.log("\n"+'Headers:');
      for( headerName in req.headers ) {
        console.log( ' - '+ headerName +': '+ req.headers[headerName] );
      }
    } else {
      console.log("\n"+'No headers');
    }

    // Check if cookies are available
    if ( Object.keys(req.cookies).length > 0 ) {
      // Print all available cookies
      console.log("\n"+'Cookies:');
      for( cookieName in req.cookies ) {
        console.log( ' - '+ cookieName +': '+ req.cookies[cookieName] );
      }
    } else {
      console.log("\n"+'No cookies');
    }

    // Print out the request body
    console.log("\n"+'Body:');
    console.log(body);
  });

  res.header('X-Debug', true);
  res.send('ok');
});

// Start the HTTP server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Debugging app listening at http://%s:%s', host, port);
  console.log("\n\n");
});