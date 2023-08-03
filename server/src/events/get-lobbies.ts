import { lobbies } from '../game/Lobbies';
import { registerEvent } from '../socket-events';

registerEvent('get-lobbies', (socket) => {
  socket.emit('lobbies-update', { lobbies });
});
