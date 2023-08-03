import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Guild } from '../../../shared/types.shared';
import { GameTitle } from '../../components/GameTitle';
import { Stack } from '../../components/Stack';
import {
  Body,
  Button,
  Container,
  Input,
  Spacing,
} from '../../components/ui-kit';
import { useUser } from '../../services/user';
import { getRandomGamertag } from '../../utils/gamertags';

import styled from 'styled-components';
import { Icon } from '../../icons';

export function GuildConfirm() {
  const { user, createNewUser } = useUser();
  // const navigate = useNavigate();
  const { guild } = useParams();
  const [nameInput, setNameInput] = useState(getRandomGamertag());
  const [telegramCode, setTelegramCode] = useState('');

  // if (user !== undefined) {
  //   navigate('/lobbies');
  // }

  const loginAndPlay = () => {
    if (!guild) return;
    if (!isFormValid()) return;
    createNewUser({ guild: guild as Guild, name: nameInput, telegramCode });
    // navigate('/lobbies');
  };

  const isFormValid = () => {
    if (nameInput.length > 16) return false;
    if (nameInput.length < 3) return false;
    if (telegramCode.length < 3) return false;
    return nameInput?.length > 2;
  };

  if (user !== undefined) {
    return <Navigate to="/lobbies" />;
  }

  if (!guild) {
    return <Navigate to="/select-guild" />;
  }

  return (
    <>
      <GameTitle />
      <Container>
        <Spacing y={20} />
        <Stack spacing={10}>
          <Body>Guild: {guild}</Body>

          <Spacing y={20} />
          <Row>
            <Body>Username:</Body>
            <Shaking onClick={() => setNameInput(getRandomGamertag())}>
              <Icon name="repeat" />
            </Shaking>
          </Row>

          {/* <Icon name="reload" /> */}

          <Input
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
            // placeholder={`How about "${getRandomGamertag()}"`}
            placeholder="Your name here"
            color={nameInput.length > 16 ? 'red' : undefined}
          />

          <Spacing y={20} />
          <Body>Telegram Code:</Body>

          <Input
            onChange={(e) => setTelegramCode(e.target.value)}
            value={telegramCode}
            placeholder="12345..."
          />
          <Body size="small">
            Say /start to{' '}
            <a target="_blank" href="https://t.me/titeeni_bot" rel="noreferrer">
              @titeeni_bot
            </a>{' '}
            to get the code
          </Body>

          <Spacing y={20} />
          <Button disabled={!isFormValid()} onClick={() => loginAndPlay()}>
            Join Game
          </Button>
        </Stack>
      </Container>
      <Spacing y={300} />
    </>
  );
}

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const Shaking = styled.span`
  animation: shake 6s infinite;
  animation-delay: 1s;
  transform-origin: 50% 50%;
  cursor: pointer;

  @keyframes shake {
    0% {
      transform: rotate(0deg);
    }
    94% {
      transform: rotate(0deg);
    }
    95% {
      transform: rotate(-15deg);
    }
    96% {
      transform: rotate(15deg);
    }
    97% {
      transform: rotate(-15deg);
    }
    98% {
      transform: rotate(15deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
