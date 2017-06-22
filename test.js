var http = require('http');
var webconsole = require('./index');  //step 1

// declare: http.createServer([requestListener])
var server = http.createServer(onRequest);
webconsole.init(server); //step 2


function onRequest(req, res){
  console.log('recv request:',req.url);
  /* webconsole midware */
  var stop=webconsole.handler(req, res);
  if(stop) return ;
  /* end */

  res.end('hello world');
}

function start(port){
  port = port || 3000 ; 
  server.listen(port);
  console.log('webconsole listenning on localhost:'+port);
}

exports.start = start;
