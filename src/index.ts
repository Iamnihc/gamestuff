//'use strict';
// ^ this makes me not hate javascript anymore

import { v4 as uuidv4 } from 'uuid';

// List of things
import {pair, User,AuthPair,Room,MessageTemplate, GamePackage, Chat, NoGame, ConnectFour, getGame} from "./classdefs";
import { isDeepStrictEqual } from 'util';
// for now this is the only "option"
// maybe later ill add options.json or something like that
// Debug for now
const debug =true;
var roomList:Array<Room> = [];


function getRoom(uuid){
  return roomList.find(room=> room.roomNum = uuid)
}

function getOnline(){
  return userList.map(x=>x.online?x.getName():false).filter(x=> x!=false)
}


function getUser(uid){
  return userList.find(x=> x.sessionID==uid);
}
// Server stuff

const port = debug? 8080:80;
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
var fileServer = require('node-static');
var http = require('http');
var file = new(fileServer.Server)("./src");
const tempServer = http.createServer(function (req:any, res:any) {
  file.serve(req, res);
  console.log("Debug attached at http://localhost:" + port + (debug? " NOT ": " ")+ "PRODUCTION")
}).listen(8080);
const io = require('socket.io')(tempServer);

// function things

// save and read
var fs = require('fs');
var userList  : User[] = syncUserBase();
function syncUserBase(){
  try {
    var data = fs.readFileSync('src/users.json');
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
  var data = JSON.stringify(userList);
  fs.writeFile('src/users.json', data, function (err:Error) {
    if (err) {
      console.log('There has been an error saving your user data.');
      console.log(err.message);
      return;
    }
    console.log('Configuration saved successfully.')
  });
}

var playerNum = 0;
var refreshed = false;

//userList.forEach(x=>console.log(x.auth))

io.on('connect', (socket:any) => {
  let connected:User;

  // connect a user
  playerNum++;
  console.log('connected');
  socket.emit()
  socket.emit('setup', (debug? "debug":"prodution") + " server. player number "+ playerNum );
  if (!refreshed){
    refreshed = true; 
    io.emit('refresh');
  }


  
  // get username
  socket.on('user', (data:string) => {
    console.log("trying to login as " + data);
    if (userList.some(x => x.getName() == data)){
      socket.emit('pin',data);
    }
    else{
      socket.emit('makepin', data)
    }
  });
  socket.on('usercreate', (data:pair) =>{
    let test = new AuthPair(data.uname, data.pin)
    console.log(test.getName());
    userList.push(new User(test));
    console.log(userList);

    //saveUserBase();
  });

  socket.on('auth', (data:pair) =>{
    console.log(userList);

    let loginUser:pair = data;
    console.log("USER!")
    console.log(loginUser)
    let possibleUser = undefined;
    console.log("USERNAMES!")
    userList.forEach(x=> console.log(x.getName()))
    console.log("looking for ")
    console.log(loginUser.uname)

    possibleUser = userList.find(x=> x.getName()== loginUser.uname);
    console.log(possibleUser)
    if (possibleUser!=undefined){
      console.log("logged in as " + loginUser.uname);
      
      connected = possibleUser;
      connected.online = true;
      connected.sessionID = socket.id;
      socket.on('disconnect', function () {
        connected.online=false;
        connected.sessionID="";
        console.log(userList);
      });
      socket.emit("login", connected);
      socket.emit("roomlist", roomList);
      io.emit("userUpdate", getOnline())
    }
  })

  socket.on(makeRoom){
    roomList.push(new Room(new ))
  }
});