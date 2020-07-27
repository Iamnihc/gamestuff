'use strict';

// definitions from index that we need
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
    readonly owner: user;
    private playerCount:number;
    protected  players:user[];
    constructor(owner: user,players:user[]=[], audience:boolean=true, lockplayers:boolean=false, lockaudience:boolean=false){
        this.owner = owner;
        this.currentPlayerNum = 0;
        this.AllowAudience=audience;
        this.aproveAudience=lockaudience;
        this.aprovePlayers=lockplayers;
        this.players = [owner,...players];
        this.playerCount = this.updatePlayerCount();
    }

    updatePlayerCount():number{ return this.players.length;}
    addPlayer( newPlayer:user){
      this.players.push(newPlayer);
    }
    abstract getLatestPlayerData(player:number):any;
    abstract getAllPlayerData(player:number):any;
  }

class chat extends gamePackage{
  gameName = "chat";
  maxPlayers = 0;
  minPlayers = 2;
  turnlock = false;
  private mesasges = [];
  private lastMessages= new Array<number>(this.players.length);
  addPlayer(newPlayer:user){
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
}
class nogame extends gamePackage{
  gameName = "Select a game";
  maxPlayers=1;
  minPlayers =1;
  getAllPlayerData(player:number){
    return "";
  }
  getLatestPlayerData(){
    return "";
  }
}
export {gamePackage};