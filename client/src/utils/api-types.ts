import { Effect, Guild, Lobby, Player } from '../../shared/types.shared';

export type ApiPlayer = {
  uuid: string;
  uname: string;
  guild: Guild;
};

// export type ApiRoomUpdateResponse = Record<
//   LobbyName,
//   Record<string, ApiPlayer>
// >;

export type ApiLobbyUpdateReponse = {
  lobbies: Lobby[];
};

export type ApiGuildpointsUpdateResponse = {
  guildPoints: {
    name: Guild;
    points: number;
  }[];
};

export type ApiEffectResponse = {
  effect: Effect;
  targets: Player[];
  discovery?: {
    spaceId: string;
    effectId: string;
  };
};
