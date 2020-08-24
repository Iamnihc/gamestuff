const $events = document.getElementById('events');
const games = ["none", "c4", "chat"]
window.onload = function(){
  console.log("aaaa");
  games.forEach(gameName=>{
    let gameButton = document.createElement("h3")
    gameButton.innerHTML = gameName;
    gameButton.onclick=function(){
      makeRoom(gameName)};
  document.getElementById("gameList").appendChild(gameButton)
  })
};
loggedIn=false;
const socket = io();
socket.on('refresh', ()=>{
  console.log("server side change??");
  location.reload(true);
})

socket.on('connect', () => {
  console.log("connect???")
  document.getElementById("isConnectedBox").innnerHTML+="true";
});

socket.on('setup', (server) => {
  document.getElementById("modeBox").innerHTML=(`Connected to server: ${server}`);
});


function checkUser(){
  var name = document.getElementById("theBox").value;
  
  socket.emit("user", name );
  console.log(name);
  return false;
};
// The user exists, ask for the pin
socket.on('pin', (uname) =>{
  var pin = prompt("user exists. enter pin");
  socket.emit('auth',{uname, pin });
});
// the user does not exist, get the pin
socket.on('makepin',(uname) =>{
    // dirty check if the users pin is a 4 digit number (really dirty)
    do {var pin = prompt("user does not exist. enter pin");}
    while (pin.length == 4 && Number.isInteger(pin) && pin>=0);
  pin = parseInt(pin);
  alert(uname +  " :your pin is now " + pin + " you can not change it");
  socket.emit('usercreate',{uname, pin });
});
socket.on("login", data =>{
  console.log(data)
});

socket.on("err",data=>{
  alert(data);
});

function makeRoom(GameType){
  console.log("aaaaaaa")
  if (["chat", "none", "c4"].includes(GameType)){
    socket.emit("newRoom", GameType)
  }
}

