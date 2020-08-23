'use strict';
import { v4 as uuidv4 } from 'uuid';

class pair{
  uname:string;
  pin:number;
}
class User{
    private auth: AuthPair;
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
    public checkAuth(authCheck:pair){
      return this.
    }
    public getName(){
      return this.auth.getName();
    }
    
}

class AuthPair{
        public uname:string;
        private pin:number;
        constructor(name:string, pin:number){
          this.uname=name;
          this.pin=pin;
        }
        public setPin(pin){
          this.pin=pin;
        }
        public checkAuth(uname,pin){
          return this.pin==pin && this.uname == uname;
        }
        public getName(){
          
          return this.uname;
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
    abstract turnLock:boolean;
    private currentPlayerNum:number;
    private allowAudience:boolean;
    private aprovePlayers: boolean;
    private aproveAudience:boolean;
    // This might cause problems. If there are problems they are here
    readonly owner: User;
    private playerCount:number;
    protected  players:User[];
    constructor(owner: User,players:User[]=[], audience:boolean=true, lockPlayers:boolean=false,  lockAudience:boolean=false){
        this.owner = owner;
        this.currentPlayerNum = 0;
        this.allowAudience=audience;
        this.aproveAudience=lockAudience;
        this.aprovePlayers=lockPlayers;
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
  turnLock = false;
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
  turnLock= false;
  getAllPlayerData(player:number){
    return "Join A Game";
  }
  getLatestPlayerData(){
    return "Join A game";
  }
  playerTurn(){
    return true;
  }
}

class ConnectFour extends GamePackage{
    gameName: string = "Connect Four";
    maxPlayers: number = 2;
    minPlayers: number = 2;
    turnLock: boolean = true;
    boardArr:Array<Array<number>>=[];
    constructor(owner: User,players:User[]=[], audience:boolean=true, lockPlayers:boolean=false, lockAudience:boolean=false){
        super(owner, players, audience,lockPlayers, lockAudience );
        for (let i = 0; i<7; i++){

        }
    }
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
export {pair,User,AuthPair,Room,MessageTemplate, GamePackage , Chat , NoGame,GameList, ConnectFour };