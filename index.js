const servername = "TEST SEVER"
var fs = require('fs');
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

var users = []

function syncUserBase(){
  var users = fs.readFileSync('./config.json'),
    myObj;

  try {
    myObj = JSON.parse(data);
    console.dir(myObj);
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }
}

function saveUserBase(){
  var data = JSON.stringify(users);

  fs.writeFile('./users.json', data, function (err) {
    if (err) {
      console.log('There has been an error saving your configuration data.');
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
  return(name,pin);
}

var rooms = [room(1)];
var playernum = 0;
const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on('connect', socket => {
  playernum++;
  console.log('connected');
  socket.emit()
  socket.emit('setup', servername + "player number "+ playernum);
  socket.on('user', data => {
    console.log("trying to login as " + data);
    if (users.includes(data)){
      socket.emit('pin',data);
    }
    else{
      socket.emit('getpin', data)
    }
  });

  
});



httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});
