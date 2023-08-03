import {
  BlacklistModel,
  GuildPointsModel,
  initDb,
  PlayerPointsModel,
} from '../src/db';
import * as mongoose from 'mongoose';
import { randomInt } from 'crypto';
import { GUILDS } from '../shared/types.shared';
import { Logger } from '../src/logger';
import {
  banPlayer,
  getAllBannedPlayers,
  isBanned,
  unbanPlayer,
} from '../src/telegram/admin-functions';

initDb().catch((err) => {
  console.log(err);
});

const blacklistablePerson = new BlacklistModel({
  playerName: 'TestPlayer',
  playerIP: '0.0.0.0',
});

let playerpoints = new PlayerPointsModel({
  guildName: 'Cluster',
  playerIP: '0.0.0.1',
  pointsDelta: 22,
  movementDelta: 2135,
  timeStamp: Date.now(),
});

// blacklistablePerson.save()

/*
playerpoints.save((err, result) => {
    console.log(result);
});
*/

/*
const players = PlayerPointsModel.find({playerIP: '0.0.0.0'}, (error: any, results: any[]) => {
    results.forEach(result => {
        console.log(result.guildName)
    })
})*/

// populateTimeSeries();
async function populateTimeSeries() {
  for (let i = 0; i < 100; i++) {
    await new PlayerPointsModel({
      guildName: 'TiK',
      playerName: 'TijamTest',
      playerIP: '0.0.0.2',
      pointsDelta: randomInt(1, 15),
      movementDelta: randomInt(500, 3500),
      timeStamp: Date.now(),
    }).save();
  }
}

// findPointsModel();
async function findPointsModel() {
  PlayerPointsModel.find(
    { playerName: 'TijamTest' },
    (error: any, results: any[]) => {
      let totalDistance = 0;
      results.forEach((result) => {
        totalDistance += result.movementDelta;
      });
      console.log(`Total distance by TijamTest: ${totalDistance}m`);

      let totalPoints = 0;
      results.forEach((result) => {
        totalPoints += result.pointsDelta;
      });
      console.log(`Total XP by TijamTest: ${totalPoints}`);
    }
  );
}

// populateGuildPoints();
async function populateGuildPoints() {
  for await (const guild of GUILDS) {
    await new GuildPointsModel({
      name: guild,
      points: randomInt(44, 255),
      log: [{ name: 'Tijam', points: 10 }],
    }).save();
  }
}

// updateGuildPoints();
async function updateGuildPoints() {
  GuildPointsModel.findOne({ name: 'tik' }, (error: any, result: any) => {
    console.log(result);
    result.points += 10;
    result.log.push({ name: 'Tijam', points: 15 });

    result.save();
  });
}

// add banned player to blacklist
// banSamplePLayers();
async function banSamplePLayers() {
  // async await 5 sec because of db connection
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await banPlayer('Testplayer', undefined);
  await banPlayer(undefined, '1235000');
  await banPlayer(undefined, undefined);
  await banPlayer('Megatestplayer', '1235000');

}

// getBannedPlayers();
async function getBannedPlayers() {
  // async await 5 sec because of db connection
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const bannedPlayers = await getAllBannedPlayers()

  console.log('Banned players:');
  console.log(bannedPlayers);

}

//unbanningTest();
async function unbanningTest() {
  // async await 5 sec because of db connection
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('init complete')

  // You can do this, but if you want to handle promise reject then look couple lines down
  const result = await unbanPlayer(undefined, undefined);
  console.log('Unbanned Testplayer: ', result);

  // This is safer way to handle promise reject
  unbanPlayer(undefined, undefined)
      .then((result) => {
        console.log('Unbanned Testplayer: ', result);
      })
      .catch((err) => {
        // Handling rejection like a boss
        console.log('Error: ', err);
      });

  const testPlayerBanned = await isBanned('Testplayer', undefined);
  console.log('Testplayer banned: ', testPlayerBanned);

}

banningStatusAwait();
async function banningStatusAwait() {
    // async await 5 sec because of db connection
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const testPlayerBanned = await isBanned('Testplayer', undefined);
    console.log('Testplayer banned: ', testPlayerBanned);
}

//unbanningNonExistingPlayer();
async function unbanningNonExistingPlayer() {
  // async await 5 sec because of db connection
  await new Promise((resolve) => setTimeout(resolve, 5000));

  unbanPlayer('Testplayeree123', undefined)
      .then((result) => {
        console.log('Unbanned player: ', result);
      })
      .catch((err) => {
        // Handling rejection like a boss
        console.log('Error: ', err);
      });
}


// useLogger();
async function useLogger() {
  let logger = new Logger('test');

  logger.commit({
    topic: 'Topic 1',
    player: {
      uuid: '123',
      guild: 'digit',
      name: 'Tijam',
      telegramUuid: '123',
    },
    content: 'Stepped on test shard',
  });

  logger.commit({
    topic: 'Topic 2',
    player: {
      uuid: '123',
      guild: 'digit',
      name: 'Tijam',
      telegramUuid: '123',
    },
    content: 'Stepped on test shard again',
  });

  logger.commit({
    topic: 'Topic 3',
    player: {
      uuid: '123',
      guild: 'digit',
      name: 'Tijam',
      telegramUuid: '123',
    },
    content: 'Stepped on test shard finally',
  });

  // console.log(logger.getCommits())
  await logger.push().then(() => {
    logger.getLog('test', (result) => {
      console.log(result);
    });
  });
}
