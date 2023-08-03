import styled, { css } from 'styled-components';
import { Body } from '../../../components/ui-kit';
import { useLobbyActions } from '../../../services/useLobbyActions';
import { useUser } from '../../../services/user';
import { Lobby, GUILDS } from '../../../../shared/types.shared';

const LOBBY_STATUS_MESSAGES: {
  [key in Lobby['status']]: string;
} = {
  // 'in-game': { message: 'In game', color: 'rgb(20,20,100)' },
  // starting: { message: 'Game starting...', color: 'rgb(70,70,70)' },
  // waiting: { message: 'Join -->', color: 'darkgreen' },
  'in-game': 'In game',
  starting: 'Game starting...',
  waiting: 'Join -->',
};

export function LobbyPreview({ lobby }: { lobby: Lobby }) {
  const { joinLobby } = useLobbyActions();
  const { user } = useUser();
  const ownGuild = user?.guild;
  const onlineGuilds = lobby.players.map((player) => player.guild);
  const offlineGuilds = GUILDS.filter((guild) => !onlineGuilds.includes(guild));

  const isGuilded =
    lobby.players.find((p) => p.guild === ownGuild) !== undefined;

  const lobbyMessage = LOBBY_STATUS_MESSAGES[lobby.status];

  const tryJoinLobby = () => {
    if (lobby.status === 'in-game') return;
    if (isGuilded) return;
    joinLobby(lobby).then(res => {
        if (res) {
            console.log('Successfully joined lobby');
        } else {
            console.log('Failed to join lobby');
            alert('Could not join lobby. (Maybe you are banned? Try refreshing page.)')
        }
    });
  };

  return (
    <LobbyBox onClick={tryJoinLobby}>
      <div>
        <LobbyName>{lobby.name}</LobbyName>
        {/* <div style={{ position: "absolute", top: 0, right: 0 }}>ownGuild</div> */}
        <GuildList>
          {onlineGuilds.map((guild) => (
            <GuildBadge key={guild} status="online">
              {guild}
            </GuildBadge>
          ))}
          {offlineGuilds.map((guild) => (
            <GuildBadge key={guild} status="offline">
              {guild}
            </GuildBadge>
          ))}
        </GuildList>
      </div>
      <Footer $isGuilded={isGuilded} status={lobby.status}>
        {lobbyMessage}
      </Footer>
    </LobbyBox>
  );
}

const Footer = styled.div<{ status: Lobby['status']; $isGuilded: boolean }>`
  background-color: ${({ status }) => {
    if (status == 'in-game') return 'rgb(20,20,100)';
    if (status == 'starting') return 'rgb(70,70,70)';
    return 'darkgreen';
  }};

  ${({ $isGuilded, status }) =>
    $isGuilded &&
    status !== 'in-game' &&
    css`
      ::after {
        content: ' (Guilded)';
      }
      opacity: 0.3;
    `}

  cursor: pointer;
  width: 100%;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 0.1rem 1rem;
  color: white;
  font-size: 1rem;
  /* position: absolute; */
  text-transform: uppercase;
`;

const GuildBadge = styled.div<{ status: 'online' | 'offline' }>`
  background-color: ${({ status }) =>
    status == 'online' ? 'forestgreen' : 'darkgray'};
  color: white;
  padding: 0.2rem;
  margin: 0.5rem;
  box-shadow: 0.2rem 0.2rem darkgreen;
`;

const GuildList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const LobbyBox = styled.div`
  border: 2px solid forestgreen;
  /* padding: 0.3rem 1rem; */
  position: relative;
  /* padding-bottom: 2rem; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LobbyName = styled(Body)`
  font-size: 1.5rem;
  background-color: black;
  width: fit-content;
  margin-top: -1.4rem;
  margin-left: 0.5rem;
`;
