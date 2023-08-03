import { Socket as SocketType } from 'socket.io';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  helloWithName: (nimi: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  uuid: string;
  name: string;
  guild: string;
}

type ServerSocket = SocketType<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type ClientToServerEventName = keyof ClientToServerEvents;
type ClientToServerEventCallback =
  ClientToServerEvents[ClientToServerEventName];

const CLIENT_TO_SERVER_EVENTS: [
  ClientToServerEventName,
  ClientToServerEventCallback
][] = [];

type EventCallback = (socket: SocketType, ...args: any[]) => any;
const EVENTS: { name: string; callback: EventCallback }[] = [];

export const registerSocketEvents = (socket: SocketType) => {
  EVENTS.forEach(({ name, callback }) => {
    socket.on(name, (...args) => callback(socket, ...args));
  });
};

export const registerEvent = (
  eventName: string, //ClientToServerEventName,
  eventCallback: EventCallback //ClientToServerEventCallback
) => {
  EVENTS.push({ name: eventName, callback: eventCallback });
};
