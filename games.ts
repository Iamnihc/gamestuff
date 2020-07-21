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
    readonly gameName:string;
    readonly maxPlayers:number;
    readonly minPlayers: number;
    private AllowAudience:boolean;
    private aprovePlayers: boolean;
    private aproveAudience:boolean;
    // This might cause problems. If there are problems they are here
    readonly owner: user;
    private playerCount:number;
    private players:user[];
    constructor(gamename: string, minPlayers: number, maxPlayers:number, owner: user,players:user[]=[], audience:boolean=true, lockplayers:boolean=false, lockaudience:boolean=false){
        this.gameName = gamename;
        this.minPlayers= minPlayers;
        this.maxPlayers = maxPlayers;
        this.owner = owner;
        this.AllowAudience=audience;
        this.players = [owner,...players];
        this.playerCount = this.updatePlayerCount();
        this.aproveAudience=lockaudience;
        this.aprovePlayers = lockplayers;
    }
    updatePlayerCount():number{ return this.players.length;}
    
    abstract getLatestPlayerData(player:number):any;
    abstract getAllPlayerData(player:number):any;
  }

class chat{

}
export {gamePackage};