import styled from 'styled-components';
import { GreenGuildImage } from '../components/GreenGuildImage';
import { Body } from '../components/ui-kit';
import { Icon } from '../icons';
import { useGuilds } from '../services/useGuilds';
import { useLockBodyScroll } from '../services/useLockBodyScroll';

export function LeaderboardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useLockBodyScroll(isOpen);

  const { guildStats } = useGuilds();

  if (!isOpen) {
    return null;
  }

  const sortedGuildStats = guildStats.sort(
    (gs1, gs2) => (gs2.points ?? 0) - (gs1.points ?? 0)
  );

  return (
    <LeaderboardModalWrapper>
      <LeaderboardModalContent>
        <LeaderboardModalHeader>Leaderboard</LeaderboardModalHeader>
        <ScoreList>
          {sortedGuildStats.map((gs, idx) => (
            <li key={gs.name}>
              <ScoreWrapper>
                <NameWrapper>
                  {idx + 1}.
                  <ImageContainer>
                    <GreenGuildImage guild={gs.name} />
                  </ImageContainer>
                  <div>{gs.name}</div>
                </NameWrapper>
                {/* <DottedLine /> */}
                <Dots />
                <NameWrapper>
                  {idx === 0 && <Icon name="trophy" size={20} color="gold" />}
                  {gs.points}
                </NameWrapper>
              </ScoreWrapper>
            </li>
          ))}
          {sortedGuildStats.length === 0 && (
            <Body size="small">No points yet :(</Body>
          )}
        </ScoreList>
        <LeaderboardModalFooter>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </LeaderboardModalFooter>
      </LeaderboardModalContent>
    </LeaderboardModalWrapper>
  );
}

const DottedLine = styled.div`
  height: 1rem;
  align-self: bottom;
  /* background: red; */
  border-bottom: 0.2rem dashed forestgreen; // #1aff00;
  flex-grow: 1;
`;

const Dots = styled.div`
  background-image: linear-gradient(
    to right,
    forestgreen 33%,
    rgba(255, 255, 0, 0) 0%
  );
  background-position: bottom;
  background-size: 0.36rem 0.12rem;
  background-repeat: repeat-x;
  height: 1rem;
  flex-grow: 1;
`;

const ScoreList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* gap: 0.1rem; */
  padding-inline: 1rem;
  list-style: none;
  /* max-width: 20rem; */
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: space-between;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  height: 20px;
  justify-content: center;
`;

const LeaderboardModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LeaderboardModalContent = styled.div`
  border: 1px solid forestgreen;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  padding: 1rem;
`;

const LeaderboardModalHeader = styled(Body)`
  padding-bottom: 0.5rem;
`;

const LeaderboardModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
`;

const CloseButton = styled(Body)`
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
