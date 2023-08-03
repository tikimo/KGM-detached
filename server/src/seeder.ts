import * as uuid from 'uuid';
import { Guild, Lobby, LobbyName, Player } from '../shared/types.shared';

const GUILDS: Guild[] = [
  'cluster',
  'tik',
  'digit',
  'algo',
  'otit',
  'date',
  'tutti',
  'tite',
];

const LOBBY_NAMES: LobbyName[] = [
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

const chanceOf = (chance: number) => Math.random() < chance;

export function getRandomLobbies() {
  console.log('Generating random players to lobbies...');
  const lobbies: Lobby[] = [];
  for (const lobbyName of LOBBY_NAMES) {
    const players: Player[] = [];
    for (const guild of GUILDS) {
      if (chanceOf(0.5)) {
        const player = {
          uuid: uuid.v4(),
          name: getRandomName() + guild,
          guild: guild,
        };
        players.push(player as Player);
      }
    }
    // COMPATIBILITY WITH OLD CODE
    // lobbies.push({ name: lobbyName, players });
  }
  return lobbies;
}

function getRandomName() {
  return 'player_' + Math.floor(Math.random() * 1000);
}
