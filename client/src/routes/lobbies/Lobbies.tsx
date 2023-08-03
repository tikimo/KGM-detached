import { useEffect } from 'react';
import styled from 'styled-components';
import { GameTitle } from '../../components/GameTitle';
import { Container, Header, Spacing } from '../../components/ui-kit';
import { useAllLobbies } from '../../services/useAllLobbies';
import { LobbyBox, LobbyPreview } from './components/LobbyPreview';

export function Lobbies() {
  const { lobbies } = useAllLobbies();

  return (
    <>
      <GameTitle />
      <Container>
        <Header>Lobbies:</Header>
        <LobbyGrid>
          {lobbies.map((lobby) => (
            <LobbyPreview key={lobby.name} lobby={lobby} />
          ))}
          {lobbies.length === 0 && <LoaderLobbies />}
        </LobbyGrid>
      </Container>
      <Spacing y={30} />
    </>
  );
}

const LoaderLobbies = () => {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <LobbyBox key={i}>
            <LobbyPreviewPlaceholder>
              <Spacing y={10} />
            </LobbyPreviewPlaceholder>
          </LobbyBox>
        ))}
    </>
  );
};

const LobbyPreviewPlaceholder = styled.div`
  // loader animation with background gradient
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    #1aff0033 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 400% 400%;
  animation: shimmer 1.2s ease-in-out infinite;
  height: 150px;

  @keyframes shimmer {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;

const LobbyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  // center grid rows
  grid-gap: 1.3rem;
`;
