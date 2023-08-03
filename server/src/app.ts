// import { RoomService } from './room_service';
// import { generateRandomPlayerToRooms } from './seeder';
import express, { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { handleSocketAuth } from './socket-auth';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  registerSocketEvents,
} from './socket-events';
import { initDb } from './db';
import { startTelegramBot } from './telegram/bot';
import { IS_DEVELOPMENT_MODE } from './development-mode';
startTelegramBot();

export const app: Express = express();
export const httpServer = http.createServer(app);
httpServer.listen(3086, () => console.log('listening on *:3086'));

initDb().catch((err) => {
  console.log(err);
});

export const io = new Server<
  ClientToServerEvents,
  any, //ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: '*',
  },
});

io.use(handleSocketAuth);

io.on('connection', (socket) => {
  console.info(`Client connected [id=${socket.id}]`);

  // These events are implemented in the events -folder
  registerSocketEvents(socket);
});

require('./events');

if (IS_DEVELOPMENT_MODE) {
  console.log(`


  ===========================================================
          !!! KGM Development Mode Enabled !!!
  ===========================================================

  
  `);
}
