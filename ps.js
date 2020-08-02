const $events = document.getElementById('events');

        const newItem = (content) => {
          const item = document.createElement('li');
          item.innerText = content;
          return item;
        };

        const socket = io();
        socket.on('refresh', ()=>{
          console.log("server side change??");
          location.reload(true);
        })
        
        socket.on('connect', () => {
          console.log("connect???")
          $events.appendChild(newItem('connected to game server'));
        });

        socket.on('setup', (server) => {
            $events.appendChild(newItem(`Connected to server: ${server}`));
        });


        function checkUser(){
          var name = document.getElementById("thebox").value;
          
          socket.emit("user", name );
          console.log(name);
          return false;
        };
        // The user exists, ask for the pin
        socket.on('pin', (username) =>{
          var pin = prompt("user exists. enter pin");
          socket.emit('auth',{username, pin });
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
        