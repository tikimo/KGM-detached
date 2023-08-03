import { LobbyName } from '../../shared/types.shared';
import { getGame } from '../game/Games';
import { getLobby, lobbies } from '../game/Lobbies';
import {BlacklistModel, GuildPointsModel, LogModel, PlayerPointsModel, TelegramModel} from '../db';
import { io } from '../app';

export function hardResetLobby(lobbyName: string) {
  const lobby = getLobby(lobbyName as LobbyName);
  if (!lobby) return 'LOBBY_NOT_FOUND' as const;

  lobby.players = [];
  lobby.isInGame = false;
  lobby.status = 'waiting';

  const game = getGame(lobbyName as LobbyName);
  if (!game) {
    return 'LOBBY_RESETED' as const;
  }
  game.players = [];

  io.in(lobbyName).emit('game-end', {
    winner: null,
  });
  io.emit('lobbies-update', { lobbies });
  return 'LOBBY_AND_GAME_RESETED' as const;
}

// ban player by one of the following: gamerTag, telegramId, ip
export function banPlayer(gamerTag?: string, telegramId?: string) {
  if (!gamerTag && !telegramId) return Promise.reject('No params');

  // First check if player is already banned
  return new Promise((resolve, reject) => {
    BlacklistModel.find().or([{ gamerTag }, { telegramId }])
      .then((docs: any) => {
        if (docs.length > 0) {
          if (docs[0].banned) {
            return reject('Player already banned');
          } else {
            docs[0].banned = true;
            docs[0].save();
            return resolve(docs[0]);
          }
        }
        else { // not in banlist, so add new entry
          const blacklistablePlayer = new BlacklistModel({});

          // ban by gamerTag
          if (gamerTag) {
            blacklistablePlayer.gamerTag = gamerTag;
          }

          // ban by telegramId
          if (telegramId) {
            blacklistablePlayer.telegramId = telegramId;
          }

          blacklistablePlayer.banned = true;

          blacklistablePlayer
              .save()
              .then(() => {
                return resolve(blacklistablePlayer);
              })
              .catch((err: any) => {
                return reject(err);
              });
        }
      });
  });
}

// unban player by one of the following: gamerTag, telegramId, ip
export function unbanPlayer(
  gamerTag?: string,
  telegramId?: string
): Promise<any | null> {
  if (!gamerTag && !telegramId) return Promise.reject('No params');
  return new Promise<any>((resolve, reject) => {
    // First check if player is already in ban list
    BlacklistModel.find().or([{ gamerTag }, { telegramId }])
        .then((docs: any) => {
          if (docs.length > 0) {
            if (docs[0].banned) {
              docs[0].banned = false;
              docs[0].save();
              return resolve(docs[0]);
            } else {
              return reject('Player already unbanned');
            }
          } else {
            return reject('Player not in banlist');
          }
        });
  });
}

// check if player is banned by any of the params
export function isBanned(
  gamerTag?: string,
  telegramId?: string
): Promise<boolean> {
  if (!gamerTag && !telegramId) return Promise.reject('No params');

  return new Promise<boolean>((resolve, reject) => {
    BlacklistModel.findOne()
      .or([{ gamerTag }, { telegramId }])
      .then((doc: any) => {
        if (doc) {
          return resolve(doc.banned);
        } else {
          return resolve(false);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}

// get banned players
export function getAllBannedPlayers(): Promise<any | null> {
  return new Promise((resolve, reject) => {
    BlacklistModel.find({})
      .then((docs: any) => {
        if (docs) {
          return resolve(docs);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}

export function getTop10Performers(): Promise<any | null> {
  return new Promise((resolve, reject) => {
    PlayerPointsModel.find({})
      .sort({ pointsDelta: -1 })
      .limit(10)
      .then((docs: any) => {
        if (docs) {
          return resolve(docs);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}

export function getLatestGameLog(gamerTag: string) {
  return new Promise((resolve, reject) => {
    LogModel.find({ log: { $regex: gamerTag } })
      .then((docs: any) => {
        if (docs) {
          let log = docs;  // A bit hacky, but it works
          return resolve(log);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}

export function getGameLog(gameId: string) {
  return new Promise((resolve, reject) => {
    LogModel.find({ gameId })
      .then((docs: any) => {
        if (docs) {
          return resolve(docs[0].log);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}

export function getGuildLog(guildname: string) {
  return new Promise((resolve, reject) => {
    GuildPointsModel.find({ name: guildname })
      .then((docs: any) => {
        if (docs) {
          return resolve(docs[0].log);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}

export function getAssociatedTg(gamerTag: string) {
  return new Promise((resolve, reject) => {
    TelegramModel.find({ gamerTag: gamerTag })
      .then((docs: any) => {
        if (docs) {
          return resolve(docs[0].telegramId);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return reject(err);
      });
  });
}