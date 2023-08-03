import { useEffect, useRef } from 'react';
import create from 'zustand';
import { GamePlayer, Space } from '../../shared/types.shared';
import { useSocket } from './socket';
import { useManualCameraPosition } from './useCameraPosition';
import { useDiscoveredSpaces } from './useDiscoveredEffects';
import { useUser } from './user';

type CharactersStore = {
  characters: GamePlayer[];
  setCharacters: (characters: GamePlayer[]) => void;
  refreshCharacters: () => void;
};

export const useCharactersStore = create<CharactersStore>((set) => ({
  characters: [],
  setCharacters: (characters: GamePlayer[]) => set({ characters }),
  refreshCharacters: () => set((state) => ({ characters: state.characters })),
}));

export function useCharacters() {
  const { characters, setCharacters } = useCharactersStore();
  const { user } = useUser();
  const socket = useSocket();
  const setCameraPosition = useManualCameraPosition((s) => s.setPosition);
  const addDiscoveredSpace = useDiscoveredSpaces((s) => s.addDiscoveredSpace);
  const ownCharacter = characters.find((c) => c.uuid === user?.uuid);

  const hasCameraAdjusted = useRef(false);

  useEffect(() => {
    if (!ownCharacter) return;
    if (ownCharacter.lastTimeMoved !== undefined) return;
    if (hasCameraAdjusted.current) return;
    console.log('SETTING CAMERA POSITION');
    setTimeout(() => {
      setCameraPosition({
        x: ownCharacter.location.x,
        y: ownCharacter.location.y,
      });
    }, 1000);
    hasCameraAdjusted.current = true;

    // return () => {
    //   hasCameraAdjusted.current = false;
    // };
  }, [ownCharacter, ownCharacter?.lastTimeMoved]);

  const moveOwnCharacter = (to: Space) => {
    console.log('MOVING');
    if (!ownCharacter) return;
    if (ownCharacter.statusList.includes('bus')) {
      if (to.labels?.includes('bus')) {
        socket.emit('move', { to });
        return;
      }
    }
    if (canPlayerMoveAlready(ownCharacter) === false) return;

    if (!hasConnection(ownCharacter.location, to)) return;
    // ownCharacter.location = to;
    // const newCharacters = characters.map((c) =>
    //   c.uuid === ownCharacter.uuid ? ownCharacter : c
    // );
    // setCharacters([...newCharacters]);
    socket.emit('move', { to });
  };

  useEffect(() => {
    if (ownCharacter?.location.id === undefined) return;
    addDiscoveredSpace(ownCharacter?.location.id, 'visited');
  }, [ownCharacter?.location]);

  return {
    characters,
    setCharacters,
    ownCharacter,
    moveOwnCharacter,
  };
}

function hasConnection(from: Space, to: Space) {
  return from.connections.includes(to.id) || to.connections.includes(from.id);
}

function canPlayerMoveAlready(player: GamePlayer) {
  if (!player.lastTimeMoved) return true;
  console.log('player.lastTimeMoved', player.lastTimeMoved);
  console.log('type of player.lastTimeMoved', typeof player.lastTimeMoved);
  const now = new Date();
  const lastTimeMoved = new Date(player.lastTimeMoved);
  const diff = now.getTime() - lastTimeMoved.getTime();

  const speed = player.speed;

  const hasDelay =
    player.statusList.includes('sausage') ||
    player.statusList.includes('gambittikokous');
  const extraDelay = hasDelay ? 10000 : 0;

  const timeForOneMove = 1000 / speed + extraDelay;
  return diff > timeForOneMove;
}
