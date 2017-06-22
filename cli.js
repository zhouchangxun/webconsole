#!/usr/bin/env node


var argv = process.argv.slice(2);
var port = 3000;
if(argv[0] === '-v'){
    console.log('version is 1.0.0');
    return;
}else if(argv[0] === '-p'){
   port = parseInt(argv[1]);
   if(!port){
     console.log('port invalid!');
    return;
   }
}else{
    console.log('Useage:');
    console.log('  -h [show help]');
    console.log('  -v [show version]');
    console.log('  -p [listener port]');
    return;
}

var webconsole = require('./test.js');
webconsole.start(port);
