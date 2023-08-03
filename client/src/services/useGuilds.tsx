import { Guild, GUILDS } from '../../shared/types.shared';
import { useSocket } from './socket';
import { useEffect, useState } from 'react';
import { ApiGuildpointsUpdateResponse } from '../utils/api-types';

export type GuildStats = {
  name: Guild;
  points?: number;
};

type GuildsHook = {
  guildStats: GuildStats[];
};

const PLACEHOLDER_STATS = GUILDS.map((g) => {
  return {
    name: g,
    points: undefined,
  };
});

export function useGuilds(): GuildsHook {
  const [guildStats, setGuildStats] = useState<GuildStats[]>(PLACEHOLDER_STATS);
  const socket = useSocket();

  useEffect(() => {
    socket.on('guildpoints-update', (data: ApiGuildpointsUpdateResponse) => {
      setGuildStats(data.guildPoints);
    });
    socket.emit('get-guildpoints');

    return () => {
      socket.off('guildpoints-update');
    };
  }, [socket]);

  /*
  lobbies.forEach((lobby) => {
    lobby.players.forEach((player) => {
      const guild = guildStats.find((g) => g.name === player.guild);
      if (guild) {
        guild.points++;
      } else {
        guildStats.push({
          name: player.guild,
          points: 1,
        });
      }
    });
  });

  GUILDS.forEach((guild) => {
    if (guildStats.find((g) => g.name === guild)) {
      guildStats.push({
        name: guild,
        points: 0,
      });
    }
  });
  */

  guildStats.sort((a, b) => a.name.localeCompare(b.name));

  return {
    guildStats,
  } as GuildsHook;
}
