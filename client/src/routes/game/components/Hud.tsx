import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useCountdown } from 'usehooks-ts';
import { GamePlayer } from '../../../../shared/types.shared';
import { Body, Button, Spacing } from '../../../components/ui-kit';
import { useManualCameraPosition } from '../../../services/useCameraPosition';
import { useCharacters } from '../../../services/useCharacters';
import { useLobbyActions } from '../../../services/useLobbyActions';
import { useEventLogStore } from '../hooks/useEventLog';

export const Hud = () => {
  const { ownCharacter } = useCharacters();
  return (
    <HudContainer>
      <EffectInfo />
      <EventLogList />
      <StatsBox>
        {/* <div>Status: TODO</div>
        <div>Effects: TODO</div> */}
        <ScrollToSelf self={ownCharacter} />
        <FlexSpace />
        <Quit />
      </StatsBox>
    </HudContainer>
  );
};

const FlexSpace = styled.div`
  flex: 1;
`;

const Quit = () => {
  const { leaveLobby } = useLobbyActions();

  const onClick = () => {
    leaveLobby();
  };

  return (
    <QuitButton onClick={onClick} size="small">
      Quit
    </QuitButton>
  );
};

const ScrollToSelf = ({ self }: { self?: GamePlayer }) => {
  const setCameraPosition = useManualCameraPosition((s) => s.setPosition);

  const onClick = () => {
    const newXY = {
      x: self?.location.x ?? 50,
      y: self?.location.y ?? 50,
    };
    setCameraPosition(newXY);
  };

  return (
    <CenterButton onClick={onClick} size="small">
      {/* Scroll to self */}
      {/* better word for scorl to self:  */}
      Center
    </CenterButton>
  );
};

const CenterButton = styled(Button)`
  pointer-events: all;
  align-self: flex-start;
`;

const QuitButton = styled(Button)`
  pointer-events: all;
  align-self: flex-end;
`;

const EventLogList = () => {
  const eventLogs = useEventLogStore((s) => s.eventLogs).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  const resetEventLogs = useEventLogStore((s) => s.resetEventLogs);

  useEffect(() => {
    resetEventLogs();
  }, [resetEventLogs]);

  return (
    <EventLogListContainer>
      {eventLogs.map((eventLog) => (
        <div key={eventLog.id}>
          [{formatTime(eventLog.createdAt)}] {eventLog.message}
        </div>
      ))}
    </EventLogListContainer>
  );
};

function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // const seconds = date.getSeconds();
  return `${hours}:${minutes}`;
}

const EventLogListContainer = styled.div`
  grid-area: events;
  /* width: 300px; */
  /* height: 300px; */
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  gap: 0.5rem;
  padding: 1rem;
  pointer-events: all;

  background-color: rgba(0, 0, 0, 0.8);

  max-height: 10rem;
  @media (min-width: 768px) {
    max-height: 15rem;
  }

  > div {
    font-size: 0.6rem;

    // media query to make the font size larger on pc
    @media (min-width: 768px) {
      font-size: 1rem;
    }

    @keyframes flash {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    // animate the height (max-height) and add the animation above to this
    animation: grow 0.5s linear forwards, flash 0.2s linear 4 alternate;
    @keyframes grow {
      from {
        max-height: 0;
      }
      to {
        max-height: 10rem;
      }
    }
  }
`;

const EffectInfo = () => {
  const { ownCharacter } = useCharacters();

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 10,
      intervalMs: 1000,
    });

  const statusList = useMemo(
    () => ownCharacter?.statusList?.filter(isTimerEffect) ?? [],
    [ownCharacter?.statusList]
  );

  useEffect(() => {
    if (statusList.length > 0) {
      resetCountdown();
      startCountdown();
    } else {
      resetCountdown();
      stopCountdown();
    }

    return () => {
      resetCountdown();
      stopCountdown();
    };
  }, [statusList]);

  if (statusList.length === 0) return null;

  if (count === 0) return null;

  return (
    <EffectInfoContainer>
      {/* {activeTimerEffects.map((effect) => (
        <Body key={effect.id}>{getTimerEffectMessage(effect.id)}</Body>
      ))} */}
      {statusList.map((status) => (
        <div key={status}>
          <Body>{getTimerEffectMessage(status)}</Body>
          <Spacing y="1rem" />
          <ProgressBar $percentage={(count / 10) * 100} />
        </div>
      ))}
    </EffectInfoContainer>
  );
};

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 0.5rem;
  background-color: black;
  position: relative;
  border: 1px solid forestgreen;
  overflow: hidden;
  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $percentage }) => $percentage}%;
    height: 100%;
    background-color: #1aff00;
  }
`;

const EffectInfoContainer = styled.div`
  position: absolute;
  // to center
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border: 1px solid #1aff00;

  // fade in in 2s
  animation: effectFadeIn 3s;
  @keyframes effectFadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const HudContainer = styled.div`
  position: fixed;
  bottom: 0;
  top: auto;
  left: 0;
  width: 100%;
  height: 100%;
  /* height: 100%; */
  pointer-events: none;
  /* border: 1px solid red; */
  /* background-color: #ff000055; */
  touch-action: none;
  display: grid;
  /* align-items: flex-end; */
  grid-template-areas:
    '. .'
    '. .'
    '. events'
    'stats stats';
  grid-template-columns: 1fr min(300px, 60%);
  grid-template-rows: 1fr auto;
  overflow: hidden;
`;

const StatsBox = styled.div`
  grid-area: stats;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid forestgreen;
  /* margin: 18px; */
  padding: 5px;
  flex-grow: 1;
  display: flex;
  /* width: ; */
  /* height: 100px; */
`;

// function isEffectActive(effect: Effect & { startedAt: Date }) {
//   const now = new Date();
//   const startedAt = effect.startedAt;
//   const diff = now.getTime() - startedAt.getTime();
//   return diff < 10000;
// }

function isTimerEffect(status: string) {
  return status === 'sausage' || status === 'gambittikokous';
}

function getTimerEffectMessage(effectId: string) {
  if (effectId === 'sausage') {
    return 'Eating sausages for 10s...';
  }
  if (effectId === 'gambittikokous') {
    return 'Gambittikokous for 10s...';
  }
  return undefined;
}
