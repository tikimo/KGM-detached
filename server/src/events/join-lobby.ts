import { leaveLobby } from './../game/Lobbies';
import { registerEvent } from '../socket-events';
import { joinLobby, lobbies } from '../game/Lobbies';
import { getPlayerBySocket } from '../game/Players';
import { io } from '../app';
import { isBanned } from '../telegram/admin-functions';
import { alertAdminsHtml } from '../telegram/bot';

registerEvent('join-lobby', async (socket, lobbyName, callback) => {
  const player = getPlayerBySocket(socket);

  // check if callback function is valid and exists
  if (!callback || typeof callback !== 'function') {
    console.log('Invalid callback function');
    alertAdminsHtml(
      `Invalid join-lobby callback function ${player?.name} tg<code>${player?.telegramUuid}</code>`
    );
    return;
  }

  if (!player) {
    console.log('Player does not exist');
    callback?.({ success: false });
    return;
  }
  if (player.lobbyName) {
    socket.leave(player.lobbyName);
  }

  const hasActiveBan = await isBanned(player.name, player.telegramUuid);

  if (hasActiveBan) {
    console.log(
      `Banned player ${player.name} tried to join lobby ${lobbyName}`
    );
    callback?.({ error: 'You are banned from the game :DD' });
    return;
  } else {
    console.log('Player is not banned');
  }

  const { success } = joinLobby(lobbyName, player);

  if (success) {
    socket.join(lobbyName);
    io.emit('lobbies-update', { lobbies });
  }

  callback?.({ success });
});
