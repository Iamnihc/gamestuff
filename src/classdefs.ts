
import { v4 as uuidv4 } from 'uuid';

class User{
    public auth: AuthPair;
    public uuid:string;
    public online:boolean;
    public roomList: string[];
    public sessionID:string;
    constructor(auth:AuthPair){
      this.auth=auth;
      this.uuid=uuidv4();
      this.online=false;
      this.roomList = [];
      this.sessionID = "";
    }
    
}

class AuthPair{
        public uname:string;
        public pin:number;
        constructor(name:string, pin:number){
          this.uname=name;
          this.pin=pin;
        }
      
}


class Room{
    public roomNum:string;
    public data:GamePackage;
    constructor(gameData:GamePackage){
      this.roomNum = uuidv4();
      this.data=gameData;
    }
  
  }

  

class MessageTemplate{
    public sender:User;
    public message:string;
    public timeMS:Date;
    public humanTime:string
    constructor(sender:User,message:string ){
      this.sender= sender;
      this.message = message;
      this.timeMS = new Date();
      this.humanTime=this.timeMS.toDateString();
    }
}


abstract class GamePackage{
    abstract gameName:string;
    abstract maxPlayers:number;
    abstract minPlayers: number;
    abstract turnlock:boolean;
    private currentPlayerNum:number;
    private AllowAudience:boolean;
    private aprovePlayers: boolean;
    private aproveAudience:boolean;
    // This might cause problems. If there are problems they are here
    readonly owner: User;
    private playerCount:number;
    protected  players:User[];
    constructor(owner: User,players:User[]=[], audience:boolean=true, lockplayers:boolean=false, lockaudience:boolean=false){
        this.owner = owner;
        this.currentPlayerNum = 0;
        this.AllowAudience=audience;
        this.aproveAudience=lockaudience;
        this.aprovePlayers=lockplayers;
        this.players = [owner,...players];
        this.playerCount = this.updatePlayerCount();
    }

    updatePlayerCount():number{ return this.players.length;}
    addPlayer( newPlayer:User){
      this.players.push(newPlayer);
    }
    abstract getLatestPlayerData(player:number):any;
    abstract getAllPlayerData(player:number):any;
    // returns true if turn is valid and successful; false otherwise.
    abstract playerTurn (player:number, turndata:any):boolean;
  }

class Chat extends GamePackage{
  gameName = "chat";
  maxPlayers = 0;
  minPlayers = 2;
  turnlock = false;
  private mesasges = new Array<MessageTemplate>();
  private lastMessages= new Array<number>(this.players.length);
 
  
  addPlayer(newPlayer:User){
    super.addPlayer(newPlayer);
    this.lastMessages.push(0);
  }
  getLatestPlayerData(playerNumber:number){
    return this.mesasges.slice(this.lastMessages[playerNumber])
    this.lastMessages[playerNumber]=this.mesasges.length;
  }
  getAllPlayerData(player:number):any{
    return this.mesasges;
  }
  playerTurn(player:number, turndata:MessageTemplate):boolean{
    this.mesasges.push(turndata)
    return true;
  }
}


class NoGame extends GamePackage{
  gameName = "Select a game";
  maxPlayers=1;
  minPlayers =1;
  turnlock= false;
  getAllPlayerData(player:number){
    return "";
  }
  getLatestPlayerData(){
    return "";
  }
  playerTurn(){
    return true;
  }
}

class ConnectFour extends GamePackage{
    gameName: string = "Connect Four";
    maxPlayers: number = 2;
    minPlayers: number = 2;
    turnlock: boolean = true;
    getLatestPlayerData(player: number) {
        throw new Error("Method not implemented.");
    }
    getAllPlayerData(player: number) {
        throw new Error("Method not implemented.");
    }
    playerTurn(player: number, turndata: any): boolean {
        throw new Error("Method not implemented.");
    }
    
}

class GameList{
    chat=Chat;
    none=NoGame;
    c4 = ConnectFour;
    all=[this.chat,this.none,this.c4];
}
export {User,AuthPair,Room,MessageTemplate, GamePackage , Chat , NoGame,GameList, ConnectFour };