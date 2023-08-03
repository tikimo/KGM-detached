/********************************************************************
 *
 * This file contains all the types that are SHARED
 * between the CLIENT and the SERVER.
 *
 ********************************************************************/

export type Player = {
  uuid: string;
  name: string;
  guild: Guild;
  lobbyName?: LobbyName;
  status?: PlayerStatus;
};

export type Space = {
  id: Uuid;
  name?: string;
  x: number;
  y: number;
  connections: Uuid[];
  labels?: string[];
};

export type ServerSpace = Space & {
  effect?: string;
};

export type Effect = {
  id: string;
  name: string;
  messageToSelf: string;
  messageToAll: string;
  handler: never;
};

/**
 * This is a player that is in the game.
 */
export type GamePlayer = Player & {
  // Name of the sqare/space, Kylpylä, Q-talo, etc.
  location: Space;
  lastTimeMoved?: Date;
  /**
   * How many spaces per second the player can move.
   * 1 => 1s to travel 1 space
   * 2 => 0.5s to travel 1 space
   *
   * The default speed is 1.
   */
  speed: number;
  statusList: string[];
};

// export type GameMap = {
//   spaces: Space[];
// };

export type Game = {
  id: string;
  // map: GameMap;
  players: GamePlayer[];
};

export type Lobby = {
  name: LobbyName;
  players: Player[];
  isInGame: boolean;
  status: 'waiting' | 'starting' | 'in-game';
};

export type PlayerStatus = 'ready' | undefined;

export type LobbyNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type LobbyName = `room_${LobbyNumber}`;

export const GUILDS = [
  'tik',
  'otit',
  'digit',
  'cluster',
  'tite',
  'date',
  'algo',
  'tutti',
] as const;

export const LOBBY_NAMES: LobbyName[] = [
  'room_0',
  'room_1',
  'room_2',
  'room_3',
  'room_4',
  'room_5',
  'room_6',
  'room_7',
  'room_8',
  'room_9',
];

export type Guild = typeof GUILDS[number];

export type Uuid = string;
