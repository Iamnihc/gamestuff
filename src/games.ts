'use strict';
import { v4 as uuidv4 } from 'uuid';
// definitions from index that we need
class AuthPair{
  public uname:string;
  public pin:number;
  constructor(name:string, pin:number){
    this.uname=name;
    this.pin=pin;
  }

}
class User{
  public auth: AuthPair;
  public uuid:string;
  public online:boolean;
  public roomlist: string[];
  public sessionid:string;
  constructor(auth:AuthPair){
    this.auth=auth;
    this.uuid=uuidv4();
    this.online=false;
    this.roomlist = [];
    this.sessionid = "";
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


abstract class gamePackage{
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

class chat extends gamePackage{
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
class nogame extends gamePackage{
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
export {gamePackage};