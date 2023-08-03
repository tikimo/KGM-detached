import { hasLobbyEnoughPlayers } from './../game/Lobbies';
import { SPACES } from './../game/Spaces';
import { lobbies, startGame } from '../game/Lobbies';
import { registerEvent } from '../socket-events';
import { areLobbyPlayersReady, getLobbyBySocket } from '../game/Lobbies';
import { io } from '../app';
import { wait } from '../utils';

registerEvent('confirm-start-game', async (socket) => {
  const lobby = getLobbyBySocket(socket);
  if (!lobby) {
    console.log('[Start] lobby not found');
    return;
  }
  if (lobby.status !== 'waiting' && lobby.status !== 'starting') {
    console.log('[Start] lobby is already in game', lobby.status);
    return;
  }

  {
    const playersReady = areLobbyPlayersReady(lobby);
    if (!playersReady) {
      console.log('[Start] players not ready');
      return;
    }
    if (!hasLobbyEnoughPlayers(lobby)) {
      console.log('[Start] not enough players');
      return;
    }

    io.in(lobby.name).emit('confirm-start-game', { lobby });
    console.log('confirm-start-game', lobby.name);
    lobby.status = 'starting';
    console.log(
      '[Start] starting lobby with players',
      lobby.players.map((p) => p.name)
    );
    io.emit('lobbies-update', { lobbies });
  }

  await wait(5000);
  // await wait(5000);

  {
    if (!hasLobbyEnoughPlayers(lobby)) {
      console.log('[Start] not enough players');
      lobby.status = 'waiting';
      io.emit('lobbies-update', { lobbies });
      return;
    }
    const gameCanStart = areLobbyPlayersReady(lobby);
    if (!gameCanStart) {
      lobby.status = 'waiting';
      io.emit('lobbies-update', { lobbies });
      return;
    }

    const game = startGame(lobby);
    lobby.status = 'in-game';
    // io.in(lobby.name).emit('start-game', { lobby });
    io.emit('lobbies-update', { lobbies });
    io.in(lobby.name).emit('game-update', { game });
    console.log('starting game', lobby.name);

    io.in(lobby.name).emit('spaces', { spaces: SPACES });
  }
});
