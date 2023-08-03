import { Socket } from 'socket.io';

const API_TOKEN = 'f55d2dc2-7f87-4259-8c6e-f2d16a33e5d7';

export const handleSocketAuth = (socket: Socket, next: (err?: any) => void) => {
  if (socket.handshake.auth.token === API_TOKEN) return next();
  // call next() with an Error if you need to reject the connection.
  next(
    new Error(
      'Authentication error. Lopeta, jookosta kookosta. Mulla on sun isovanhempien kotiosoite.'
    )
  );
};
