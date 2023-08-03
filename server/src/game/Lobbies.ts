import { IS_DEVELOPMENT_MODE } from './../development-mode';
// import { getRandomLobbies } from '../seeder';
import { Socket } from 'socket.io';
import { Lobby, LobbyName, Player } from '../../shared/types.shared';
import { createGame, setGame } from './Games';
import { createLobbies } from './utils';

export const lobbies: Lobby[] = createLobbies();

/**************
 * Lobby utils
 **************/

export const isPlayerInLobby = (lobby: Lobby, player: Player) => {
  return lobby.players.find((p) => p.uuid === player.uuid);
};

export const getLobby = (lobbyName: LobbyName) => {
  return lobbies.find((l) => l.name === lobbyName);
};

export const getLobbyByPlayer = (player: Player) => {
  return lobbies.find((l) => isPlayerInLobby(l, player));
};

export const joinLobby = (lobbyName: LobbyName, player: Player) => {
  player.status = undefined;
  const lobby = getLobby(lobbyName);
  if (!lobby) return { success: false, error: 'Lobby not found' };

  if (isPlayerInLobby(lobby, player)) {
    return { success: false, error: 'Player already in lobby' };
  }

  lobby.players.push(player);
  player.lobbyName = lobbyName;

  console.log(`[Lobby] Player ${player.name} joined lobby ${lobby.name}`);
  // console.log(lobby.players);
  return { success: true };
};

export const leaveLobby = (player: Player) => {
  const lobby = lobbies.find((l) => isPlayerInLobby(l, player));
  if (!lobby) return { success: false, error: 'Player not in lobby' };

  lobby.players.splice(lobby.players.indexOf(player), 1);
  player.lobbyName = undefined;

  console.log(`[Lobby] Player ${player.name} left lobby ${lobby.name}`);

  if (lobby.players.length === 0) {
    console.log(`[Lobby] Lobby ${lobby.name} is empty, deleting`);
    lobby.status = 'waiting';
    lobby.isInGame = false;
    lobby.players = [];
  }

  return { success: true };
};

export const areLobbyPlayersReady = (lobby: Lobby) => {
  return lobby.players.every((p) => p.status === 'ready');
};

const MIN_PLAYERS = 3;
export const hasLobbyEnoughPlayers = (lobby: Lobby) => {
  if (IS_DEVELOPMENT_MODE) {
    console.log('[Lobby] Development mode: skipping lobby player count check');
    return true;
  }
  return lobby.players.length >= MIN_PLAYERS;
};

export const startGame = (lobby: Lobby) => {
  lobby.isInGame = true;
  const newGame = createGame(lobby);
  setGame(lobby.name, newGame);

  return newGame;
};

export const getLobbyBySocket = (socket: Socket) => {
  return lobbies.find((l) => socket.rooms.has(l.name));
};
