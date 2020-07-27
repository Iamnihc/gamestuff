'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// for now this is the only "option"
// maybe later ill add options.json or something like that
// Debug for now
var debug = true;
// user generator
function user(name, pin) {
    if (pin === void 0) { pin = 1234; }
    return ({ name: name, pin: pin });
}
// Server stuff
var port = debug ? 8080 : 80;
var content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
var fileserver = require('node-static');
var http = require('http');
var file = new (fileserver.Server)();
var tempserver = http.createServer(function (req, res) {
    file.serve(req, res);
    console.log("Debug attached at http://localhost:" + port + (debug ? " NOT " : " ") + "PRODUCTION");
}).listen(8080);
var io = require('socket.io')(tempserver);
// function things
// save and read
var fs = require('fs');
var users = syncUserBase();
function syncUserBase() {
    try {
        var data = fs.readFileSync('./users.json');
        var list = JSON.parse(data);
        console.dir(list);
        return list;
    }
    catch (err) {
        // i know this throws an error if the file doesnt exist but thats ok for now
        console.log('There has been an error parsing your JSON.');
        console.log(err);
        return [];
    }
    return [];
}
function saveUserBase() {
    var data = JSON.stringify(users);
    fs.writeFile('./users.json', data, function (err) {
        if (err) {
            console.log('There has been an error saving your user data.');
            console.log(err.message);
            return;
        }
        console.log('Configuration saved successfully.');
    });
}
var playernum = 0;
io.on('connect', function (socket) {
    // connect a user
    playernum++;
    console.log('connected');
    socket.emit();
    socket.emit('setup', (debug ? "debug" : "prodution") + " server. player number " + playernum);
    // get username
    socket.on('user', function (data) {
        console.log("trying to login as " + data);
        if (users.some(function (x) { return x.auth.name == data; })) {
            socket.emit('pin', data);
        }
        else {
            socket.emit('makepin', data);
        }
    });
    socket.on('usercreate', function (data) {
        users.push(user(data.name, data.pin));
        console.log(users);
        console.log(data);
        saveUserBase();
    });
    socket.on('auth', function (data) {
        console.log(users);
        socket.emit("uuid");
        var loginuser = user(data.name, data.pin);
        if (users.includes(loginuser)) {
            console.log("logged in as " + loginuser.name);
        }
    });
});
