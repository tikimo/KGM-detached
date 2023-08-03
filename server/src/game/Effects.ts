import { getGame, getGamePlayer } from './Games';
import { Player, GamePlayer } from './../../shared/types.shared';
import { SPACES, SpaceId } from './Spaces';
import { Lobby, LobbyName, Space } from '../../shared/types.shared';
import { lobbies } from './Lobbies';
import { generateEffects } from './helpers/EffectGenerator';

export type ServerEffect = {
  id: string;
  name: string;
  messageToSelf: string;
  messageToAll: string;
  handler: (effectPlayer: GamePlayer) => void;
  condition?: (effectPlayer: GamePlayer) => boolean;
};

export type LobbyEffectLists = {
  [key in LobbyName]: Map<SpaceId, ServerEffect>;
};

const lobbyEffectLists: LobbyEffectLists = {
  room_0: new Map(),
  room_1: new Map(),
  room_2: new Map(),
  room_3: new Map(),
  room_4: new Map(),
  room_5: new Map(),
  room_6: new Map(),
  room_7: new Map(),
  room_8: new Map(),
  room_9: new Map(),
};

export function getEffect(lobbyName: LobbyName, destination: Space) {
  const effects = lobbyEffectLists[lobbyName];
  const currentEffect = effects.get(destination.id as SpaceId);
  return currentEffect;
}

export function removeEffect(
  lobbyName: LobbyName | undefined,
  destination: Space
) {
  const effects = lobbyEffectLists[lobbyName as LobbyName];
  effects.delete(destination.id as SpaceId);
}

export function initEffects(lobby: Lobby) {
  const effects = lobbyEffectLists[lobby.name];
  effects.clear();
  console.log(`Creating effects for ${lobby.name}: `);
  generateEffects(effects);
}

export const Effects = {
  E_SCOOTER: {
    id: 'e-scooter',
    name: 'E-Scooter',
    messageToSelf: 'You found an e-scooter! +20% speed!',
    messageToAll: '{player} found an e-scooter! +20% speed!',
    handler: (effectPlayer: GamePlayer) => {
      applySpeedEffect(effectPlayer, 1.2);
    },
  },
  GLASS_SHARD: {
    id: 'glass-shard',
    name: 'Glass Shard',
    messageToSelf: 'You stepped on a glass shard! -20% speed!',
    messageToAll: '{player} stepped on a glass shard! -20% speed!',
    handler: (effectPlayer: GamePlayer) => {
      applySpeedEffect(effectPlayer, 1 / 1.2);
    },
  },
  BUS: {
    id: 'bus',
    name: 'Bus',
    messageToSelf:
      'You hopped on a bus! Pick a destination! Yellow circles indicate the possible destinations.',
    messageToAll: '{player} hopped on a bus!',
    handler: (effectPlayer: GamePlayer) => {
      handleBusTeleport(effectPlayer);
    },
    condition: (effectPlayer: GamePlayer) => {
      return !effectPlayer.statusList.includes('bus');
    },
  },
  SAUSAGE: {
    id: 'sausage-grill',
    name: 'Sausage grilling',
    messageToSelf:
      'Some teekkaris are grilling sausages. You decide to join them and to eat one sausage. Staying here for 10 seconds.',
    messageToAll: '{player} is eating sausages.',
    handler: (effectPlayer: GamePlayer) => {
      handleSausageGrill(effectPlayer);
    },
  },
  XP_SMALL: {
    id: 'xp-small',
    name: 'Small XP',
    messageToSelf: 'You found a small XP bottle! +1 XP!',
    messageToAll: '{player} +1 XP!',
    handler: (effectPlayer: GamePlayer) => {
      applyXpEffect(effectPlayer, 1);
    },
  },
  XP_MEDIUM: {
    id: 'xp-medium',
    name: 'Medium XP',
    messageToSelf: 'You found a medium XP bottle! +3 XP!',
    messageToAll: '{player} +3 XP!',
    handler: (effectPlayer: GamePlayer) => {
      applyXpEffect(effectPlayer, 2);
    },
  },
  XP_LARGE: {
    id: 'xp-large',
    name: 'Large XP',
    messageToSelf: 'You found a large XP bottle! +5 XP!',
    messageToAll: '{player} +5 XP!',
    handler: (effectPlayer: GamePlayer) => {
      applyXpEffect(effectPlayer, 3);
    },
  },
  DRUNK: {
    id: 'drunk',
    name: 'Drunk',
    messageToSelf:
      'You stopped to drink some beer, but you are now drunk. -50% FPS?',
    messageToAll: '{player} is now drunk.',
    handler: (effectPlayer: GamePlayer) => {
      applyDrunkEffect(effectPlayer);
    },
  },
  GAMBITTIKOKOUS: {
    id: 'gambittikokous',
    name: 'Gambittikokous',
    messageToSelf: 'You started Gambitti-kokous. 10 seconds of pure joy.',
    messageToAll: '{player} is having a gambittikokous.',
  },
};

/********************
 * Effect handlers
 ********************/

function applySpeedEffect(gamePlayer: GamePlayer, speedMultiplier: number) {
  gamePlayer.speed *= speedMultiplier;
  console.log('New speed for', gamePlayer.name, 'is', gamePlayer.speed);
  getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
    topic: 'Speed',
    player: gamePlayer,
    content: `is now ${speedMultiplier}x times faster = ${gamePlayer.speed}`,
  });
}

function handleBusTeleport(gamePlayer: GamePlayer) {
  gamePlayer.statusList.push('bus');
  const oldSpeed = gamePlayer.speed;
  gamePlayer.speed = 1;
  setTimeout(() => {
    gamePlayer.speed = oldSpeed;
    // gamePlayer.statusList = gamePlayer.statusList.filter(
    //   (status) => status !== 'bus'
    // );
  }, 10000);

  console.log('Bus teleport effect');
  getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
    topic: 'Bus',
    player: gamePlayer,
    content: `is on a bus from ${gamePlayer.location.id}`,
  });
}

function handleSausageGrill(gamePlayer: GamePlayer) {
  console.log('Sausage grill effect');
  getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
    topic: 'Sausage',
    player: gamePlayer,
    content: `is eating sausages`,
  });
  gamePlayer.statusList.push('sausage');
  setTimeout(() => {
    gamePlayer.statusList = gamePlayer.statusList.filter(
      (status) => status !== 'sausage'
    );
  }, 10000);
}

function applyXpEffect(gamePlayer: GamePlayer, xp_type: number) {
  switch (xp_type) {
    case 1:
      gamePlayer.xp.small++;
      getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
        topic: 'XP',
        player: gamePlayer,
        content: `+1 XP`,
      });
      break;
    case 2:
      gamePlayer.xp.medium++;
      getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
        topic: 'XP',
        player: gamePlayer,
        content: `+3 XP`,
      });
      break;
    case 3:
      gamePlayer.xp.large++;
      getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
        topic: 'XP',
        player: gamePlayer,
        content: `+5 XP`,
      });
      break;
    default:
      break;
  }

  removeEffect(gamePlayer.lobbyName, gamePlayer.location);
}

function applyDrunkEffect(gamePlayer: GamePlayer) {
  gamePlayer.statusList.push('drunk');

  getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
    topic: 'Drunk',
    player: gamePlayer,
    content: `is drunk`,
  });

  setTimeout(() => {
    gamePlayer.statusList = gamePlayer.statusList.filter(
      (status) => status !== 'drunk'
    );
  }, 30000);
}

export function applyGambittiKokousEffect(
  gamePlayer: GamePlayer,
  playerInSpace: GamePlayer
) {
  gamePlayer.statusList.push('gambittikokous');
  playerInSpace.statusList.push('gambittikokous');

  getGame(gamePlayer.lobbyName as LobbyName)?.log.commit({
    topic: 'GambittiKokous',
    player: gamePlayer,
    content: `started Gambitti-kokous with ${playerInSpace.name}`,
  });

  setTimeout(() => {
    gamePlayer.statusList = gamePlayer.statusList.filter(
      (status) => status !== 'gambittikokous'
    );
    playerInSpace.statusList = playerInSpace.statusList.filter(
      (status) => status !== 'gambittikokous'
    );
    setTimeout(() => {
      playerInSpace.statusList = playerInSpace.statusList.filter(
        (status) => status !== 'drunk'
      );
    }, 10000);
  }, 10000);
}
