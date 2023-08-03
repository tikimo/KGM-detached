import { io } from '../app';
import { getGame, leaveFromGame } from '../game/Games';
import { leaveLobby, lobbies } from '../game/Lobbies';
import { getPlayerBySocket } from '../game/Players';
import { registerEvent } from '../socket-events';
import {handleGameEnd} from "../game/GameEnd";
import {GamePlayer} from "../../shared/types.shared";

registerEvent('leave-lobby', (socket) => {
  const player = getPlayerBySocket(socket);
  if (!player) {
    console.log('Player not found for socket: ', socket.id);
    return;
  }

  const game = getGame(player.lobbyName);
  console.log('leaving game', game);
  if (game) {
    console.log('leaving game...');
    leaveFromGame(player);

    // If less than 2 players, end the game
    // > 0 because in dev we play with only one player. should never happen in prod
    if (game.players.length < 2 && game.players.length > 0) {
      handleGameEnd(game.players.at(0) as GamePlayer, false);
      // kick the winner (remaining player) gracefully
      io.in(player.lobbyName as string).emit('game-end', {
          winner: game.players.at(0),
      });

    }
  }
  leaveLobby(player);
  if (player.lobbyName) socket.leave(player.lobbyName);
  io.emit('lobbies-update', { lobbies });
});
