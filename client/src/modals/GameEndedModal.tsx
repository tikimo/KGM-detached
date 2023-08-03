import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCountdown } from 'usehooks-ts';
import { Body, Button, Row } from '../components/ui-kit';
import { Icon } from '../icons';
import { StaticCharacter } from '../routes/game/components/Character';
import { EndResult } from '../services/useGame';

const REDIRECT_COUNTDOWN_SECONDS = 25;

export function GameEndedModal({ endResult }: { endResult?: EndResult }) {
  const navigate = useNavigate();
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: REDIRECT_COUNTDOWN_SECONDS,
      intervalMs: 1000,
    });

  // navigate to main lobby after 5 seconds after game ended
  useEffect(() => {
    if (!endResult) return;
    startCountdown();
    const t = setTimeout(() => {
      leave();
    }, REDIRECT_COUNTDOWN_SECONDS * 1000);
    return () => {
      stopCountdown();
      resetCountdown();
      clearTimeout(t);
    };
  }, [endResult]);

  const leave = () => {
    resetCountdown();
    stopCountdown();
    navigate('/lobbies');
  };

  const isButtonClickable = count < REDIRECT_COUNTDOWN_SECONDS - 5;

  if (!endResult) {
    return null;
  }

  return (
    <ModalWrapper>
      <Content>
        <Centered>
          <Title>GAME ENDED</Title>
          <Body>
            <u>{endResult.winner.guild}</u> won!
          </Body>
          <CenteredRow>
            <Relative>
              <Icon name="trophy" size="100%" color="gold" />
            </Relative>

            <StaticCharacter
              mode="winner"
              name={endResult.winner.name}
              size="10rem"
              uuid={endResult.winner.uuid}
            />
            <Relative>
              <Icon name="trophy" size="100%" color="gold" />
            </Relative>
          </CenteredRow>
        </Centered>

        <Body size="small">
          Player <u>{endResult.winner.name}</u> found the Gambit!
        </Body>
        {/* <Body>
          Guild <u>{endResult.winner.guild}</u> gets 1 point!
        </Body> */}
        <Body size="xsmall">
          You will be redirected to lobby list in {count} seconds.
        </Body>
        <Button disabled={!isButtonClickable} onClick={leave}>
          Exit game
        </Button>
      </Content>
    </ModalWrapper>
  );
}

const Relative = styled.div`
  flex: 1;
  max-width: 6rem;
  aspect-ratio: 1;
  position: relative;
`;

const CenteredRow = styled(Row)`
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  animation: fadeIn 3s linear;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    33% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  background-color: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
  border: 1px solid forestgreen;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  padding: 1rem;
  margin: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(Body)`
  font-size: 4rem;
  text-align: center;
`;
