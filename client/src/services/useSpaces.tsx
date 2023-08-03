import { useEffect, useState } from 'react';
import { Space } from '../../shared/types.shared';
import { useSocket } from './socket';

type ApiResponse = {
  spaces: Space[];
};

export const useSpaces = () => {
  const socket = useSocket();
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    console.log('useSpaces useEffect');
    socket.on('spaces', (data: ApiResponse) => {
      console.log('spaces', data);
      setSpaces(data.spaces);
    });
    socket.emit('get-spaces');
    return () => {
      socket.off('spaces');
    };
  }, [socket]);

  return spaces;
};
