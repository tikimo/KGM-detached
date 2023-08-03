import { Lobby, LobbyName } from '../../shared/types.shared';

export const createLobbies = () => {
  const lobbies: Lobby[] = [];
  for (let i = 0; i < 10; i++) {
    lobbies.push({
      name: `room_${i}` as LobbyName,
      players: [],
      isInGame: false,
      status: 'waiting',
    });
  }
  return lobbies;
};
