const servername = "TEST SEVER"
var fs = require('fs');
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

var users = syncUserBase();

function syncUserBase(){

  try {
    var data = fs.readFileSync('./users.json');
    users = JSON.parse(data);
    console.dir(users);
    return users;
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
    return [];
  }
}

function saveUserBase(){
  var data = JSON.stringify(users);

  fs.writeFile('./users.json', data, function (err) {
    if (err) {
      console.log('There has been an error saving your user data.');
      console.log(err.message);
      return;
    }
    console.log('Configuration saved successfully.')
  });
}

function room(number, type="empty", players = []){

    return (number, type, players)
}

function user(name, pin=1234){
  return( {name,pin} );
}

var rooms = [room(1)];
var playernum = 0;



var static = require('node-static');
var http = require('http');

var file = new(static.Server)();

const mightwork = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8080);

const io = require('socket.io')(mightwork);

io.on('connect', socket => {
  playernum++;
  console.log('connected');
  socket.emit()
  socket.emit('setup', servername + "player number "+ playernum);
  socket.on('user', data => {
    console.log("trying to login as " + data);
    if (users.some(x => x.name == data)){
      socket.emit('pin',data);
    }
    else{
      socket.emit('makepin', data)
    }
  });
  socket.on('usercreate', data =>{
    users.push(user(data.uname, data.pin));
    console.log(users);
    console.log(data);
    saveUserBase();
  });
  socket.on('auth', data =>{
    console.log(users);
    let loginuser = user(data.uname, data.pin);
    if (users.includes(loginuser)){
      console.log("logged in as " + loginuser.name);
    }
  })
});


