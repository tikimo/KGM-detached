import { Socket } from 'socket.io';
import {
  GamePlayer,
  GUILDS,
  Player,
  PlayerStatus,
} from '../../shared/types.shared';

const playersBySocket = new Map<Socket, Player>();

export const getPlayerBySocket = (socket: Socket) => {
  return playersBySocket.get(socket);
};

export const addPlayer = (socket: Socket, player: Player) => {
  playersBySocket.delete(socket);

  if (isPlayerOnline(player)) {
    console.log('Player already exists');
    return { success: false };
  }

  playersBySocket.set(socket, player);
  return { success: true };
};

export const removePlayerBySocket = (socket: Socket) => {
  const player = playersBySocket.get(socket);
  if (!player) return { success: false, error: 'Player not found' };
  playersBySocket.delete(socket);

  return { success: true };
};

export const isPlayerOnline = (player: Player) => {
  for (const [, p] of playersBySocket) {
    if (p.uuid === player.uuid) return true;
  }
  return false;
};

/**
 * Checks if the given object is a Player type.
 */
export const isPlayer = (obj: any): obj is Player => {
  const isUuidOk = typeof obj.uuid === 'string';
  const isNameOk = typeof obj.name === 'string';
  const isGuildOk = typeof obj.guild === 'string' && GUILDS.includes(obj.guild);

  return isUuidOk && isNameOk && isGuildOk;
};

export const setPlayerStatus = (player: Player, status: PlayerStatus) => {
  player.status = status;
};

export const getSpeed = (player: GamePlayer) => {
  return player.speed;
};

export const isTelegramUuidInUse = (uuid: string) => {
  for (const [socket, player] of playersBySocket) {
    console.log(`Telegram (for ${player.name}) is in use`);
    if (player.telegramUuid === uuid) return true;
  }
  console.log(`Telegram id is NOT in use`);

  return false;
};
