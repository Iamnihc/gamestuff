'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.gamePackage = void 0;
var messageTemplate = /** @class */ (function () {
    function messageTemplate(sender, message) {
        this.sender = sender;
        this.message = message;
        this.timeMS = new Date();
        this.humanTime = this.timeMS.toDateString();
    }
    return messageTemplate;
}());
var gamePackage = /** @class */ (function () {
    function gamePackage(owner, players, audience, lockplayers, lockaudience) {
        if (players === void 0) { players = []; }
        if (audience === void 0) { audience = true; }
        if (lockplayers === void 0) { lockplayers = false; }
        if (lockaudience === void 0) { lockaudience = false; }
        this.owner = owner;
        this.currentPlayerNum = 0;
        this.AllowAudience = audience;
        this.aproveAudience = lockaudience;
        this.aprovePlayers = lockplayers;
        this.players = __spreadArrays([owner], players);
        this.playerCount = this.updatePlayerCount();
    }
    gamePackage.prototype.updatePlayerCount = function () { return this.players.length; };
    gamePackage.prototype.addPlayer = function (newPlayer) {
        this.players.push(newPlayer);
    };
    return gamePackage;
}());
exports.gamePackage = gamePackage;
var chat = /** @class */ (function (_super) {
    __extends(chat, _super);
    function chat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gameName = "chat";
        _this.maxPlayers = 0;
        _this.minPlayers = 2;
        _this.turnlock = false;
        _this.mesasges = new Array();
        _this.lastMessages = new Array(_this.players.length);
        return _this;
    }
    chat.prototype.addPlayer = function (newPlayer) {
        _super.prototype.addPlayer.call(this, newPlayer);
        this.lastMessages.push(0);
    };
    chat.prototype.getLatestPlayerData = function (playerNumber) {
        return this.mesasges.slice(this.lastMessages[playerNumber]);
        this.lastMessages[playerNumber] = this.mesasges.length;
    };
    chat.prototype.getAllPlayerData = function (player) {
        return this.mesasges;
    };
    chat.prototype.playerTurn = function (player, turndata) {
        this.mesasges.push(turndata);
        return true;
    };
    return chat;
}(gamePackage));
var nogame = /** @class */ (function (_super) {
    __extends(nogame, _super);
    function nogame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gameName = "Select a game";
        _this.maxPlayers = 1;
        _this.minPlayers = 1;
        _this.turnlock = false;
        return _this;
    }
    nogame.prototype.getAllPlayerData = function (player) {
        return "";
    };
    nogame.prototype.getLatestPlayerData = function () {
        return "";
    };
    nogame.prototype.playerTurn = function () {
        return true;
    };
    return nogame;
}(gamePackage));
