import { leaveLobby } from './Lobbies';
import { GamePlayer } from '../../shared/types.shared';
import { Game, Lobby, Player, Space } from '../../shared/types.shared';
import { SPACES } from './Spaces';
import { initEffects } from './Effects';
import { handleGameEnd, initGambitLocation } from './GameEnd';
import { Logger } from '../logger';
import { getSpeed } from './Players';
import { alertAdminsHtml } from '../telegram/bot';

const gamesByLobbyName = new Map<string, Game>();

export const createGame = (lobby: Lobby) => {
  function generateShortUID() {
    // generate the UID from two parts here
    // to ensure the random number provide enough bits.
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    let fps = ('000' + firstPart.toString(36)).slice(-3);
    let sps = ('000' + secondPart.toString(36)).slice(-3);
    return fps + sps;
  }
  let suid = `${lobby.name}_${generateShortUID()}`;

  const game: Game = {
    id: suid,
    // map: {
    //   spaces: SPACES,
    // },
    players: lobby.players.map((p) => ({
      ...p,
      location: getRandomStartLocation(),
      speed: 1,
      statusList: [],
      xp: { small: 0, medium: 0, large: 0 },
    })),
    log: new Logger(suid),
  };
  initEffects(lobby);
  initGambitLocation(lobby);
  return game;
};

export const getGame = (lobbyName?: string) => {
  if (!lobbyName) return;
  return gamesByLobbyName.get(lobbyName);
};

export const setGame = (lobbyName: string, game: Game) => {
  gamesByLobbyName.set(lobbyName, game);
};

export const removeGame = (lobbyName: string) => {
  gamesByLobbyName.delete(lobbyName);
};

const getRandomStartLocation = () => {
  const index = Math.floor(Math.random() * SPACES.length);
  return SPACES[index];
};

const hackerMoves = new Map<string, number>();

export const movePlayer = (player: Player, to: Space) => {
  if (!player.lobbyName) return;

  const game = getGame(player.lobbyName);
  if (!game) return;

  const destination = SPACES.find((s) => s.id === to.id);
  if (!destination) return;

  const playerInGame = game.players.find((p) => p.uuid === player.uuid);
  if (!playerInGame) return;

  if (!canPlayerMoveAlready(playerInGame)) {
    const moves = hackerMoves.get(playerInGame.uuid);
    if (moves === undefined) {
      hackerMoves.set(playerInGame.uuid, 1);
      alertAdminsHtml(
        'Hacker? tried to move while on cooldown' +
          getPlayerInfoString(playerInGame)
      );
      return;
    }
    hackerMoves.set(playerInGame.uuid, moves + 1);
    if (moves % 100 === 0) {
      alertAdminsHtml(
        `Hacker? tried to move (${moves} times already) while on cooldown ` +
          getPlayerInfoString(playerInGame)
      );
    }
    return;
  }

  if (!canMoveTo(playerInGame, destination)) {
    console.log('not valid move');

    return;
  }

  playerInGame.location = destination;
  playerInGame.lastTimeMoved = new Date();
  playerInGame.movementAmount = playerInGame.movementAmount
    ? playerInGame.movementAmount + 1
    : 1;

  console.log('Moving the player');

  return game;
};

function getPlayerInfoString(player: GamePlayer) {
  return `\n[${player.guild}] ${player.name} (tg: <code>${player.telegramUuid}</code>)`;
}

function canMoveTo(player: GamePlayer, to: Space) {
  if (player.statusList.includes('bus')) {
    console.log('Checking if bus stop?');
    return to.labels?.includes('bus') === true;
  }
  return hasConnection(player.location, to);
}

function hasConnection(from: Space, to: Space) {
  return from.connections.includes(to.id) || to.connections.includes(from.id);
}

function canPlayerMoveAlready(player: GamePlayer) {
  if (!player.lastTimeMoved) return true;
  const now = new Date();
  const diff = now.getTime() - player.lastTimeMoved.getTime();

  const speed = getSpeed(player);

  const hasDelay =
    player.statusList.includes('sausage') ||
    player.statusList.includes('gambittikokous');
  const extraDelay = hasDelay ? 10000 : 0;

  const timeForOneMove = 1000 / speed + extraDelay;
  return diff > timeForOneMove;
}

export function getGamePlayer(game: Game, player: Player) {
  return game.players.find((p) => p.uuid === player.uuid);
}

export function leaveFromGame(
  player: Player
): player is Player & { lobbyName: string } {
  if (!player.lobbyName) {
    console.log('false: no lobby name');
    return false;
  }
  const game = getGame(player.lobbyName);
  if (!game) {
    console.log('false: no game');
    return false;
  }

  const index = game.players.findIndex((p) => p.uuid === player.uuid);
  if (index === -1) {
    console.log('false: no player');
    return false;
  }

  game.players.splice(index, 1);

  game.log.commit({
    topic: 'Leave',
    player: player,
    content: 'Player left from game (removed).',
  });
  console.log('Player left from game (removed).');

  return true;
}

export function updateStatusList(player: GamePlayer) {
  if (player.statusList.includes('bus')) {
    player.statusList.splice(player.statusList.indexOf('bus'), 1);
    console.log('removing the bus effect', player.statusList);
  }
}
