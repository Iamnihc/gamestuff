'use strict';
// this makes me not hate javascript anymore

// Debug for now
const debug =true;

// List of games
enum games{
  empty,
  connect4
}

const port = debug? 8080:80;

var fs = require('fs');



const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
interface user{
  name:string;
  pin:number;
}
var users : user[] = syncUserBase();

function syncUserBase(){

  try {
    var data = fs.readFileSync('./users.json');
    var list = JSON.parse(data);
    console.dir(list);
    return list;
  }
  catch (err ) {
    // i know this throws an error if the file doesnt exist but thats ok for now
    console.log('There has been an error parsing your JSON.')
    console.log(err);
    return [];
    
  }
  return [];
}

function saveUserBase(){
  var data = JSON.stringify(users);
  fs.writeFile('./users.json', data, function (err:Error) {
    if (err) {
      console.log('There has been an error saving your user data.');
      console.log(err.message);
      return;
    }
    console.log('Configuration saved successfully.')
  });
}

interface room{
  roomnum : number;
  gametype:games ;
  players:user[] ;
  spectators: user[];
  
}

function user(name : string, pin:number=1234){
  return( {name,pin} );
}

var playernum = 0;

var fileserver = require('node-static');
var http = require('http');

var file = new(fileserver.Server)();

const tempserver = http.createServer(function (req:any, res:any) {
  file.serve(req, res);
  console.log("Debug attached at http://localhost:" + port + (debug? " NOT ": " ")+ "PRODUCTION")
}).listen(8080);

const io = require('socket.io')(tempserver);

io.on('connect', (socket:any) => {
  playernum++;
  console.log('connected');
  socket.emit()
  socket.emit('setup', (debug? "debug":"prodution") + " server. player number "+ playernum);
  socket.on('user', (data:string) => {
    console.log("trying to login as " + data);
    if (users.some(x => x.name == data)){
      socket.emit('pin',data);
    }
    else{
      socket.emit('makepin', data)
    }
  });
  socket.on('usercreate', (data:user) =>{
    users.push(user(data.name, data.pin));
    console.log(users);
    console.log(data);
    saveUserBase();
  });
  socket.on('auth', (data:user) =>{
    console.log(users);
    let loginuser = user(data.name, data.pin);
    if (users.includes(loginuser)){
      console.log("logged in as " + loginuser.name);
    }
  })
});