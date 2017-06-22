# webconsole
browser console based on websocket.

## example
```js
  1 var express = require('express');
  2 var http = require('http');
  3 var webconsole = require('webconsole');  //step 1
  4 
  5 var app = express(); // the main app
  6 var server = http.createServer(app);
  7 
  8 webconsole.init(server); //step 2
  9 app.use(webconsole.handler); // step3. mount the sub app
 10 
 11 server.listen(3000);
 12 
 13 app.get('*', function(req, res){
 14   res.send('hello world');
 15 });
 16 
 17 console.log('boot web server sucess!');

```
