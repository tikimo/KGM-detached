import { io } from '../app';
import { getPlayerBySocket, setPlayerStatus } from '../game/Players';
import { registerEvent } from '../socket-events';
import { getLobbyByPlayer, lobbies } from './../game/Lobbies';

registerEvent('set-ready', (socket) => {
  const player = getPlayerBySocket(socket);
  if (!player) return;

  const lobby = getLobbyByPlayer(player);
  if (!lobby) return;

  // Check if guild is present in lobby
  const hasDups = hasDuplicates(lobby.players.map((p) => p.guild));

  if (!hasDups) {
    setPlayerStatus(player, 'ready');
    console.log(`Player ${player?.name} is ready [id: ${socket.id}]`);

    console.log(`Updating lobby ${lobby.name}`);

    if (player.lobbyName) {
      io.in(player.lobbyName).emit('lobbies-update', { lobbies });
    }
  } else {
    console.log(`Player ${player?.name} tried to join with duplicate guild name`);
  }
});

function hasDuplicates(a: any) {

  const noDups = new Set(a);

  return a.length !== noDups.size;
}