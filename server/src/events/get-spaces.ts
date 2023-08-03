import { lobbies } from '../game/Lobbies';
import { SPACES } from '../game/Spaces';
import { registerEvent } from '../socket-events';

registerEvent('get-spaces', (socket) => {
  socket.emit('spaces', { spaces: SPACES });
});
