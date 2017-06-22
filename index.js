var fs = require('fs'),
    socketio = require('socket.io'),
    child_pty = require('child_pty'),
    ss = require('socket.io-stream');

var default_conf = require('./config.json');
var prefix = '/admin';

var ptys = {};

function _fileExists(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

function handler(req, res, next) {
	var file = null;
	var stop = true;
        if(!req.url.startsWith('/admin/')){
            if(next) next(); 
            return;
        }

	var url = req.url.substr(prefix.length, req.url.lenght);
        var fix_path = '../';
        if(_fileExists(__dirname+'/node_modules')){
           fix_path = 'node_modules/';
        }

	switch(url) {
	case '/':
	case '/index.html':
		file = '/lib/index.html';
		break;
	case '/webterm.js':
		file = '/lib/webterm.js';
		break;
	case '/terminal.js':
		file = '/'+fix_path+'terminal.js/dist/terminal.js';
		break;
	case '/socket.io-stream.js':
		file = '/'+fix_path+'socket.io-stream/socket.io-stream.js';
		break;
	default:
	        console.log('no found:',req.url);
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('404 Not Found');
		return stop;
	}
	fs.createReadStream(__dirname + file).pipe(res);
	return stop;
}


//kill all child on main process exit.
process.on('exit', function() {
	var k = Object.keys(ptys);
	var i;

	for(i = 0; i < k.length; i++) {
		ptys[k].kill('SIGHUP');
	}
});

function init(httpServer, config=default_conf){
    socketio(httpServer).of('pty').on('connection', function(socket) {
	// receives a bidirectional pipe from the client see index.html
	// for the client-side
	ss(socket).on('new', function(stream, options) {
		var name = options.name;

		var pty = child_pty.spawn('/bin/sh', ['-c', config.login], options);
		pty.stdout.pipe(stream).pipe(pty.stdin);
		ptys[name] = pty;
		socket.on('disconnect', function() {
			console.log("end");
			pty.kill('SIGHUP');
			delete ptys[name];
		});
	});
    });

}

exports.init= init;
exports.handler= handler;

