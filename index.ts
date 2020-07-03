'use strict';
// this makes me not hate javascript anymore
enum games{
  empty,
  connect4
}
const servername = "TEST SEVER"
interface authpair {
  uname:string;
  pin:string;
}
var fs = require('fs');
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
interface user{
  name:string;
  pin:number;
}
var users : user[]= syncUserBase();

function syncUserBase(){

  try {
    var data = fs.readFileSync('./users.json');
    users = JSON.parse(data);
    console.dir(users);
    return users;
  }
  catch (err ) {
    // i know this throws an error if the file doesnt exist but thats ok for now
    console.log('There has been an error parsing your JSON.')
    console.log(err);
    return [];
  }
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


}
function makeroom(roomnum:number, gametype:games = games.empty, players:user[]=[]):room{
  return {roomnum, gametype,players};
}
function user(name : string, pin:number=1234){
  return( {name,pin} );
}

var rooms:room[] = [makeroom(1)] ;
var playernum = 0;



var fileserver = require('node-static');
var http = require('http');

var file = new(fileserver.Server)();

const mightwork = http.createServer(function (req:any, res:any) {
  file.serve(req, res);
  console.log("Debug attached at http://localhost:8080. NOT PRODUCTION")
}).listen(8080);

const io = require('socket.io')(mightwork);

io.on('connect', (socket:any) => {
  playernum++;
  console.log('connected');
  socket.emit()
  socket.emit('setup', servername + "player number "+ playernum);
  socket.on('user', (data:string) => {
    console.log("trying to login as " + data);
    if (users.some(x => x.name == data)){
      socket.emit('pin',data);
    }
    else{
      socket.emit('makepin', data)
    }
  });
  socket.on('usercreate', (data:authpair) =>{
    users.push(user(data.uname, parseInt(data.pin)));
    console.log(users);
    console.log(data);
    saveUserBase();
  });
  socket.on('auth', (data:authpair) =>{
    console.log(users);
    let loginuser = user(data.uname, parseInt(data.pin));
    if (users.includes(loginuser)){
      console.log("logged in as " + loginuser.name);
    }
  })
});