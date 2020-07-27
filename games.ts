'use strict';
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
    abstract  minPlayers: number;
    private AllowAudience:boolean;
    private aprovePlayers: boolean;
    private aproveAudience:boolean;
    // This might cause problems. If there are problems they are here
    readonly owner: user;
    private playerCount:number;
    protected  players:user[];
    constructor(owner: user,players:user[]=[], audience:boolean=true, lockplayers:boolean=false, lockaudience:boolean=false){
        this.gameInfo()
        this.owner = owner;
        this.AllowAudience=audience;
        this.aproveAudience=lockaudience;
        this.aprovePlayers=lockplayers;
        this.players = [owner,...players];
        this.playerCount = this.updatePlayerCount();
    }
    gameInfo(){

    }
    updatePlayerCount():number{ return this.players.length;}
    
    abstract getLatestPlayerData(player:number):any;
    abstract getAllPlayerData(player:number):any;
  }

class chat extends gamePackage{
  gameName = "chat";
  maxPlayers = 0;
  minPlayers = 2;
  private mesasges = [];
  private lastMessages= new Array<number>(this.players.length);

  getLatestPlayerData(player:number){
    return this.mesasges.slice(this.lastMessages[player])
  
  }
  getAllPlayerData(player:number):any{
    return this.mesasges;
  }
}
export {gamePackage};