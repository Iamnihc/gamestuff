'use strict';
// this makes me not hate javascript anymore
// Debug for now
var debug = true;
// List of games
var games;
(function (games) {
    games[games["empty"] = 0] = "empty";
    games[games["connect4"] = 1] = "connect4";
})(games || (games = {}));
var port = debug ? 8080 : 80;
var fs = require('fs');
var content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
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
function user(name, pin) {
    if (pin === void 0) { pin = 1234; }
    return ({ name: name, pin: pin });
}
var playernum = 0;
var fileserver = require('node-static');
var http = require('http');
var file = new (fileserver.Server)();
var tempserver = http.createServer(function (req, res) {
    file.serve(req, res);
    console.log("Debug attached at http://localhost:" + port + (debug ? " NOT " : " ") + "PRODUCTION");
}).listen(8080);
var io = require('socket.io')(tempserver);
io.on('connect', function (socket) {
    playernum++;
    console.log('connected');
    socket.emit();
    socket.emit('setup', (debug ? "debug" : "prodution") + " server. player number " + playernum);
    socket.on('user', function (data) {
        console.log("trying to login as " + data);
        if (users.some(function (x) { return x.name == data; })) {
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
        var loginuser = user(data.name, data.pin);
        if (users.includes(loginuser)) {
            console.log("logged in as " + loginuser.name);
        }
    });
});
