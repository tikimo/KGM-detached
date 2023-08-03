import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { GUILDS } from '../../../shared/types.shared';
import { GameTitle } from '../../components/GameTitle';
import { GreenGuildImage } from '../../components/GreenGuildImage';
import { Stack } from '../../components/Stack';
import { Body, Container, Spacing } from '../../components/ui-kit';
import { useUser } from '../../services/user';
import { TutorialModal } from '../../modals/TutorialModal';

export function SelectGuild() {
  const navigate = useNavigate();
  const { user } = useUser();

  // const [showTutorial, setShowTutorial] = useLocalStorage<boolean>(
  //   'showTutorial',
  //   true
  // );
  const [showTutorial, setShowTutorial] = useState(true);

  const setGuild = (guild: string) => {
    navigate(`/guild-confirm/${guild}`);
  };

  useEffect(() => {
    if (user !== undefined) {
      navigate('/lobbies');
    }
  }, [user]);

  return (
    <>
      <GameTitle />
      <TutorialModal
        isOpen={showTutorial}
        onClose={(dontShowAgain) => {
          setShowTutorial(!dontShowAgain);
        }}
      />
      <Container>
        <Stack spacing={10}>
          <Body>{`Valitse kiltasi >`}</Body>
          <Spacing y={10} />
          {/* {guildStats.map((guild) => (
            <Row key={guild.name} onClick={() => setGuild(guild.name)}>
              <Body
                style={{
                  marginRight: '40px',
                  display: 'flex',
                  paddingBottom: '0.2rem',
                }}
              >
                {showMvpIndocator(guild.name, mvp) && <Icon name="trophy" />}
              </Body>
              <Clickable variant="filled" onClick={() => setGuild(guild.name)}>
                {guild.name}
              </Clickable>
              <Body>|</Body>
              <Body
                style={{
                  minWidth: '100px', // so that 9999xp fits
                }}
              >
                {guild.points ?? ''}
              </Body>
            </Row>
          ))} */}
          <GuildContainer>
            {GUILDS.map((guild) => (
              <GuildCard key={guild} onClick={() => setGuild(guild)}>
                <Body size="small">{guild}</Body>
                <ImageContainer>
                  <GreenGuildImage guild={guild} />
                </ImageContainer>
              </GuildCard>
            ))}
          </GuildContainer>
        </Stack>
      </Container>
      <Spacing y={80} />
    </>
  );
}
const GuildContainer = styled.div`
  display: grid;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
  /* background-color: darkgreen; */

  grid-template-columns: 1fr 1fr 1fr 1fr;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
  grid-auto-rows: 1fr;

  /* background-color: white; */
`;

const GuildCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px solid white;
  padding: 0.8rem;
  padding-top: 0;
  cursor: pointer;

  gap: 0.5rem;

  box-sizing: border-box;

  :hover {
    background-color: #030;
    border-color: #1aff00;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
`;
