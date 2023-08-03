import create from 'zustand';
import { Lobby } from '../../shared/types.shared';
import { useAllLobbies } from './useAllLobbies';

type SelectedLobbyStore = {
  lobby: Lobby | undefined;
  setLobby: (lobby: Lobby | undefined) => void;
};

export const useSelectedLobby = create<SelectedLobbyStore>((set) => ({
  lobby: undefined,
  setLobby: (lobby: Lobby | undefined) => set({ lobby }),
}));

export const useLobby = () => {
  const { lobbies } = useAllLobbies();
  const { lobby } = useSelectedLobby();

  const lobbyFromAllLobbies = lobbies.find(
    (l: Lobby) => l.name === lobby?.name
  );

  return {
    lobby: lobbyFromAllLobbies,
  };
};
