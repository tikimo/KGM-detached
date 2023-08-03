import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game, Player } from '../../shared/types.shared';
import { useEventLogStore } from '../routes/game/hooks/useEventLog';
import { ApiEffectResponse } from '../utils/api-types';
import { useSocket } from './socket';
import { useCharacters } from './useCharacters';
import { useDiscoveredSpaces } from './useDiscoveredEffects';
import { useEffectStore } from './useEffects';

export type EndResult = {
  winner: Player;
};

export const useGame = () => {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const navigate = useNavigate();
  const [endResult, setEndResult] = useState<EndResult | undefined>(undefined);
  const addEventLog = useEventLogStore((s) => s.addEventLog);
  const addEffect = useEffectStore((s) => s.addEffect);
  const addDiscoveredSpace = useDiscoveredSpaces((s) => s.addDiscoveredSpace);
  // const refreshCharacters = useCharactersStore((s) => s.refreshCharacters);

  const { setCharacters, ownCharacter } = useCharacters();
  const socket = useSocket();

  useEffect(() => {
    socket.on('game-update', (data: any) => {
      console.log('DATA:', data);
      setGame(data.game);
      console.log('game', data.game);
      console.log('characters', data.game.players);
      setCharacters(data.game.players ?? []);
    });

    return () => {
      socket.off('game-update');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('game-end', (data: any) => {
      console.log('game ended!', data);
      if (data.winner) {
        setEndResult({
          winner: data.winner,
        });
      } else {
        setGame(undefined);
        navigate('/lobbies');
      }
    });

    return () => {
      setEndResult(undefined);
      socket.off('game-end');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('effect', (data: ApiEffectResponse) => {
      console.log('effect!', data);
      const message = data.effect.messageToAll.replace(
        '{player}',
        data.targets[0].name
      );
      addEventLog(message);
      if (data.targets.find((t) => t.uuid === ownCharacter?.uuid)) {
        addEffect(data.effect);
      }
      if (data.effect.id === 'bus') {
        // console.log('REFRESHING CHARACTERS BECAUSE OF BUS EFFECT!');
        // refreshCharacters();
        // setTimeout(() => {
        //   console.log('REFRESHING CHARACTERS BECAUSE OF BUS EFFECT!');
        //   refreshCharacters();
        // }, 100);
      }
      if (data.discovery) {
        addDiscoveredSpace(data.discovery.spaceId, data.discovery.effectId);
      }
    });

    return () => {
      socket.off('effect');
    };
  }, [socket, ownCharacter?.uuid]);

  return {
    game,
    endResult,
    ownCharacter,
  };
};

// useEffect(() => {
//   console.log('LISTENING');
//   socket.on('start-game', (data: any) => {
//     console.log('start game data', data);
//     console.log('game', data.game);
//     setGame(data.game);
//   });

//   return () => {
//     socket.off('start-game');
//   };
// }, [socket]);
