import { useNavigate } from 'react-router-dom';
import { Lobby } from '../../shared/types.shared';
import { useSocket } from './socket';
import { useSelectedLobby } from './useSelectedLobby';

export function useLobbyActions() {
  const navigate = useNavigate();
  const socket = useSocket();
  const setLobby = useSelectedLobby((store) => store.setLobby);

  function joinLobby(lobby: Lobby): Promise<boolean> {
    return new Promise((resolve) => {
      socket.emit(
        'join-lobby',
        lobby.name,
        ({ success }: { success: boolean; error: string }) => {
          console.log('Joining lobby: ', lobby.name, success);
          if (success) {
            setLobby(lobby);
            navigate('/lobby');
          }
          resolve(success);
        }
      );
    });
  }

  function confirmStartGame() {
    socket.emit('confirm-start-game');
  }

  function setReady() {
    socket.emit('set-ready');
  }

  function leaveLobby() {
    socket.emit('leave-lobby');
    setLobby(undefined);
    navigate('/lobbies');
  }

  return {
    joinLobby,
    leaveLobby,
    setReady,
    confirmStartGame,
  };
}
