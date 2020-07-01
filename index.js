const servername = "TEST SEVER"

const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

function room(number, type="empty", players = []){

    return (number, type, players)
}

var rooms = [room(1)];





const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on('connect', socket => {
  console.log('connected');
  socket.emit()
  socket.emit('setup', servername);
});

httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});
