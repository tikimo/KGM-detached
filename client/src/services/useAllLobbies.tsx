import { useEffect, useState } from 'react';
import { Lobby } from '../../shared/types.shared';
import { ApiLobbyUpdateReponse } from '../utils/api-types';
import { useSocket } from './socket';

interface LobbiesHook {
  lobbies: Lobby[];
}

export function useAllLobbies(): LobbiesHook {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const socket = useSocket();

  useEffect(() => {
    socket.on('lobbies-update', (data: ApiLobbyUpdateReponse) => {
      setLobbies(data.lobbies);
    });
    socket.emit('get-lobbies');

    return () => {
      socket.off('lobbies-update');
    };
  }, [socket]);

  return {
    lobbies,
  } as LobbiesHook;
}
