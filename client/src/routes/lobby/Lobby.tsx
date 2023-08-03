import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCountdown } from 'usehooks-ts';
import { Lobby as LobbyType, Player } from '../../../shared/types.shared';
import { Stack } from '../../components/Stack';
import { Body, Button, Container, Row, Spacing } from '../../components/ui-kit';
import { seededRandomNumber } from '../../components/utils';
import { Icon } from '../../icons';
import { useDiscoveredSpaces } from '../../services/useDiscoveredEffects';
import { useLobbyActions } from '../../services/useLobbyActions';
import { useUser } from '../../services/user';
import { useLobby } from '../../services/useSelectedLobby';
import { useDeveloperMode } from '../../utils/developer-mode';
import { StaticCharacter } from '../game/components/Character';
import { RandomStartingMessage } from './components/RandomStartingMessage';

const FullButton = styled(Button)`
  width: 100%;
`;

const SpacedContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: 'space-between';
  position: relative;
`;

const MIN_PLAYERS = 3;
const AFK_SECONDS_WHEN_READY = 500;
const AFK_SECONDS_WHEN_NOT_READY = 120;

export function Lobby() {
  const devMode = useDeveloperMode();
  const { lobby } = useLobby();
  const { user } = useUser();
  const { leaveLobby, setReady, confirmStartGame } = useLobbyActions();
  const navigate = useNavigate();
  const clearDiscoveredSpaces = useDiscoveredSpaces(
    (s) => s.clearDiscoveredSpaces
  );

  const ownPlayer = lobby?.players.find((player) => player.uuid === user?.uuid);

  const afkKickSeconds =
    ownPlayer?.status === 'ready'
      ? AFK_SECONDS_WHEN_READY
      : AFK_SECONDS_WHEN_NOT_READY;

  const startGame = () => {
    confirmStartGame();
  };

  useEffect(() => {
    // clearVisitedSpaces();
    clearDiscoveredSpaces();
  }, []);

  console.log('lobby: ', lobby);

  if (!isPlayerInLobby(lobby, user)) {
    navigate('/lobbies');
    return null;
  }
  if (!lobby) {
    navigate('/lobbies');
    return null;
  }

  if (lobby.status === 'in-game') {
    navigate('/game');
  }

  const isEveryoneReady = lobby.players.every(
    (player) => player.status === 'ready'
  );

  const canStartGame =
    (lobby.players.length >= MIN_PLAYERS || devMode) &&
    isEveryoneReady &&
    lobby.status === 'waiting';
  // lobby.players = DUMMY_PLAYERS;

  return (
    <>
      <Spacing y="1rem" />
      <SpacedContainer>
        <Row justify="flex-end">
          <span>
            <Body
              display="inline-block"
              color={lobby.players.length < MIN_PLAYERS ? 'red' : undefined}
            >
              {lobby.players.length}
              <Body display="inline-block">/8</Body>
            </Body>
          </span>
        </Row>
        <Body>
          Lobby {lobby.name}: {lobby.status}
        </Body>
        {lobby.status == 'starting' && <RandomStartingMessage />}
        {lobby.status !== 'starting' && (
          <AfkTimerInterval time={afkKickSeconds} callback={leaveLobby} />
        )}

        <PlayersContainer>
          {lobby.players.map((player) => (
            <LobbyPlayerPreview key={player.uuid} player={player} />
          ))}
        </PlayersContainer>

        <Spacing y="10rem" />

        <ButtonContainer spacing={16}>
          <FullButton
            disabled={ownPlayer?.status === 'ready'}
            onClick={setReady}
            mode="attention"
          >
            Set ready
          </FullButton>
          <FullButton
            disabled={!canStartGame}
            onClick={startGame}
            mode="attention"
          >
            {lobby.status === 'waiting' ? 'Start game' : 'Starting...'}
          </FullButton>
          {/* <FullButton onClick={forceStart}>Force start (debug)</FullButton> */}
          <FullButton
            disabled={lobby.status === 'starting'}
            onClick={leaveLobby}
          >
            Leave lobby
          </FullButton>
        </ButtonContainer>
      </SpacedContainer>
    </>
  );
}

function isPlayerInLobby(lobby?: LobbyType, player?: Player) {
  console.log('IS player in lobby?');
  if (!lobby || !player) return false;
  console.log('IS player in lobby? (2)');
  if (lobby.players.length === 0) return false;
  console.log('IS player in lobby? (3)');

  return lobby?.players.some((p) => p.uuid === player?.uuid);
}

const AfkTimerInterval = ({
  time,
  callback,
}: {
  time: number;
  callback: () => void;
}) => {
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: time,
      intervalMs: 1000,
    });

  useEffect(() => {
    resetCountdown();
    startCountdown();
  }, [time]);

  useEffect(() => {
    startCountdown();

    return () => {
      stopCountdown();
      resetCountdown();
    };
  }, []);

  if (count === 0) {
    callback();
    return null;
  }

  if (count >= 60) return null;
  return <Body size="xsmall">AFK kick: {count}s</Body>;
};

const ButtonContainer = styled(Stack)`
  position: sticky;
  background: black;
  /* width: 100%; */
  bottom: 1rem;
  /* padding-bottom: 1rem; */
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const LobbyPlayerPreview = ({ player }: { player: Player }) => {
  return (
    <PlayerView key={player.uuid}>
      <PlayerCharacter name={player.name} size="7rem" uuid={player.uuid} />
      <div>{player.status == 'ready' ? <Ready /> : <NotReady />}</div>
      <Body size="xsmall">{`<${player.guild}>`}</Body>
      <Body size="xsmall">{cutName(player.name, 10)}</Body>
      {/* <Body size="xsmall">{` <${player.guild}> ${player.name}`}</Body> */}
    </PlayerView>
  );
};

function cutName(name: string, length: number) {
  if (name.length > length) {
    return name.slice(0, length) + '.';
  }
  return name;
}

const PlayerCharacter = styled(StaticCharacter)<{ name: string; uuid: string }>`
  padding: 0 0.5rem;
  // random jump animation in every 30s
  animation: lobbyJump ${(props) => 4 + seededRandomNumber(props.name) * 4}s
    infinite linear;
  animation-delay: ${(props) => seededRandomNumber(props.name) * 5}s;
  @keyframes lobbyJump {
    0% {
      transform: translateY(0);
    }
    92% {
      transform: translateY(0);
    }
    97% {
      transform: translateY(-0.5rem);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const PlayerView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* overflow: hidden; */

  // scale from 0 to 1 when loaded
  scale: 0;
  animation: lobbyPlayerIn 0.5s forwards;
  animation-delay: 0.5s;
  @keyframes lobbyPlayerIn {
    0% {
      scale: 0;
    }
    100% {
      scale: 1;
    }
  }
`;

const Ready = () => (
  <>
    <Icon
      name="checkbox"
      size="1.2rem"
      style={{
        transform: 'translateY(0.2rem)',
      }}
    />
    <span style={{ color: '#1aff00' }}>{' ready'}</span>
  </>
);

const NotReady = () => (
  <span>
    <Icon
      name="checkboxEmpty"
      color="#FF1a00"
      size="1.2rem"
      style={{
        transform: 'translateY(0.2rem)',
      }}
    />
    <span style={{ color: '#FF1a00' }}>{' waiting'}</span>
  </span>
);
