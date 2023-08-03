import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Lobbies } from './routes/lobbies/Lobbies';
import { Root } from './routes/root/Root';
import { SelectGuild } from './routes/select-guild/SelectGuild';
import { GuildConfirm } from './routes/guild-confirm/GuildConfirm';
import { ProtectedRoute } from './services/ProtectedRoute';
import { Lobby } from './routes/lobby/Lobby';
import { Game } from './routes/game/Game';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Navigate to="/" />,
    children: [
      {
        path: '/',
        element: <Navigate to="/select-guild" />,
      },
      {
        path: '/lobbies',
        element: (
          <ProtectedRoute>
            <Lobbies />
          </ProtectedRoute>
        ),
      },
      {
        path: '/lobby',
        element: (
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        ),
      },
      {
        path: '/game',
        element: (
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        ),
      },
      {
        path: '/select-guild',
        element: <SelectGuild />,
      },
      {
        path: '/guild-confirm/:guild',
        element: <GuildConfirm />,
      },
    ],
  },
]);
