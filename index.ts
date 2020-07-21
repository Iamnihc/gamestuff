'use strict';
// this makes me not hate javascript anymore
import { v4 as uuidv4 } from 'uuid';
// for now this is the only "option"
// maybe later ill add options.json or something like that
// Debug for now
const debug =true;


// interfaces and stuff
// im still working this one out... i think each player gets n number of rooms tho

// users
interface authpair{
  name:string;
  pin:number;
}
interface user{
  auth: authpair;
  uuid:string;
  online:boolean;
  roomlist: string[];
  
}
// List of games
import * as games from "./games";


interface room{
  owner:user;
  private:boolean;
  spectateAllowed:boolean;
  roomNum:number;
  maxPlayers:number;
  players:user[];
  audience:user[];
  data:games.gamePackage;
}


// user generator
function user(name : string, pin:number=1234){
  return( {name,pin} );
}

// Server stuff

const port = debug? 8080:80;
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
var fileserver = require('node-static');
var http = require('http');
var file = new(fileserver.Server)();
const tempserver = http.createServer(function (req:any, res:any) {
  file.serve(req, res);
  console.log("Debug attached at http://localhost:" + port + (debug? " NOT ": " ")+ "PRODUCTION")
}).listen(8080);
const io = require('socket.io')(tempserver);

// function things

// save and read
var fs = require('fs');
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

var playernum = 0;

io.on('connect', (socket:any) => {
  // connect a user
  playernum++;
  console.log('connected');
  socket.emit()
  socket.emit('setup', (debug? "debug":"prodution") + " server. player number "+ playernum);

  // get username
  socket.on('user', (data:string) => {
    console.log("trying to login as " + data);
    if (users.some(x => x.auth.name == data)){
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
    socket.emit("uuid", )
    let loginuser = user(data.name, data.pin);
    if (users.includes(loginuser)){
      console.log("logged in as " + loginuser.name);
    }
  })
});