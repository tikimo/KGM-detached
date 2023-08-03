import { handleGameEnd } from '../game/GameEnd';
import { getGame, leaveFromGame } from '../game/Games';
import { registerEvent } from '../socket-events';
import { io } from './../app';
import { leaveLobby, lobbies } from './../game/Lobbies';
import { getPlayerBySocket, removePlayerBySocket } from './../game/Players';

registerEvent('disconnect', (socket) => {
  const player = getPlayerBySocket(socket);
  if (player) {
    const leavingSuccess = leaveFromGame(player);
    if (leavingSuccess) {
      const game = getGame(player.lobbyName);
      console.log(
        `player ${player.name} left the game, ${game?.players.length} players left`
      );
      if (game?.players.length === 0) {
        console.log('All players left. Resetting the game.');

        getGame(player.lobbyName)?.log.commit({
          topic: 'End',
          player: player,
          content: 'No players. Last player leaving. Terminated Game.',
        });
        getGame(player.lobbyName)?.log.push();

        // NOTE: setting this to false does not save any XP to db!!
        // For cases where lobby ends due to less than 2 players, we need to save XP to db
        // However, in this particular case, we don't want to save XP to db
        // since the game was terminated by the server for all players leaving
        handleGameEnd(player, false);
      }

      io.emit('lobbies-update', { lobbies });
      if (player.lobbyName)
        io.in(player.lobbyName).emit('game-update', { game });
    }

    leaveLobby(player);
  }

  removePlayerBySocket(socket);
  console.log(`Player ${player?.name} disconnected [id: ${socket.id}]`);
});
