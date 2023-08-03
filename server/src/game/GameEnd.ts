import { SPACES } from './Spaces';
import {
  Game,
  Lobby,
  LobbyName,
  Player,
  Space,
} from '../../shared/types.shared';
import { selectRandomFromArray } from '../utils';
import { leaveLobby, lobbies } from './Lobbies';
import { getGame } from './Games';
import { GuildPointsModel, PlayerPointsModel } from '../db';
import { alertAdmins, alertAdminsHtml } from '../telegram/bot';

type GambitLocations = {
  [key in LobbyName]: Space;
};

const gambitLocations: GambitLocations = {
  room_0: SPACES[0],
  room_1: SPACES[0],
  room_2: SPACES[0],
  room_3: SPACES[0],
  room_4: SPACES[0],
  room_5: SPACES[0],
  room_6: SPACES[0],
  room_7: SPACES[0],
  room_8: SPACES[0],
  room_9: SPACES[0],
};

export function isWinningMove(lobbyName: LobbyName, destination: Space) {
  return gambitLocations[lobbyName].id === destination.id;
}

export function initGambitLocation(lobby: Lobby) {
  gambitLocations[lobby.name] = getRandomSpaceForGambit();
  console.log(
    `Gambit location for ${lobby.name} is ${gambitLocations[lobby.name].id}`
  );
}

function getRandomSpaceForGambit() {
  return selectRandomFromArray(SPACES);
}

export function handleGameEnd(winner: Player, didWin: boolean) {
  console.log('Handling game end');
  let lobbyName = winner.lobbyName as LobbyName;
  let game = getGame(lobbyName) as Game;

  // check if game has duplicate guilds
  const hasDups = hasDuplicates(game.players.map((p) => p.guild));
  if (hasDups) {
    console.log('Game had duplicate guilds');
  } else  {
    // Save XP
    if (didWin) saveXPToDB(game, winner);

    // Save playerpoints
    if (didWin) savePlayerPointsToDB(game, winner);
  }

  // Report to Telegram
  let responseHTML = `<b>Game ended${didWin ? ' with a win' : ''}</b>${
    hasDups ? ' (with duplicate guilds)' : ''
  }
<code>${game.id}</code>
------------------------
${game.players
  .map((p) => {
    let xp =
      p.xp.small +
      p.xp.medium * 3 +
      p.xp.large * 5 +
      (didWin && p.uuid === winner.uuid ? 15 : 0);
    return `${p.uuid === winner.uuid ? '* ' + p.guild : p.guild} - ${p.name} - ${xp}`;
  })
  .join('\n')}
  `;
  alertAdminsHtml(responseHTML);

  // Save Log
  getGame(lobbyName)?.log.push();

  console.log('TODO: handling game end');
  const lobby = lobbies.find((l) => l.name === lobbyName);
  if (!lobby) return;
  lobby.players = [];
  lobby.isInGame = false;
  lobby.status = 'waiting';
}

export function saveXPToDB(game: Game, winner: Player) {
  console.log('Saving XP to DB');
  for (const player of game.players) {
    GuildPointsModel.findOne(
      { name: player.guild },
      (error: any, result: any) => {
        // Gather XP
        let total_xp =
          player.xp.small + player.xp.medium * 3 + player.xp.large * 5;
        if (winner.uuid === player.uuid) {
          total_xp += 15;
        }

        // Save XP
        result.points += total_xp;
        result.log.push({
          name: player.name,
          points: total_xp,
          gameId: game.id,
        });
        result.save();
      }
    );
  }
}

export async function savePlayerPointsToDB(game: Game, winner: Player) {
  console.log('Saving Player Points to DB');
  for (const player of game.players) {
    // Gather XP
    let total_xp = player.xp.small + player.xp.medium * 3 + player.xp.large * 5;
    if (winner.uuid === player.uuid) {
      total_xp += 15;
    }

    new PlayerPointsModel({
      guildName: player.guild,
      playerName: player.name,
      pointsDelta: total_xp,
      movementDelta: player.movementAmount,
      timeStamp: new Date(),
    })
      .save()
      .then(() => console.log('Saved player points to DB'))
      .catch((err) => console.log(err));
  }
}


function hasDuplicates(a: any) {

  const noDups = new Set(a);

  return a.length !== noDups.size;
}