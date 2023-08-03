import { useEffect, useRef, useState } from 'react';
import { FullScreenHandle } from 'react-full-screen';
import styled, { css } from 'styled-components';
import { Body, Spacing } from '../../../components/ui-kit';
import { Icon } from '../../../icons';
import { HelpModal } from '../../../modals/HelpModal';
import { LeaderboardModal } from '../../../modals/LeaderboardModal';
import { useUser } from '../../../services/user';
import {
  DeveloperModeButton,
  useDeveloperMode,
} from '../../../utils/developer-mode';

const StyledBar = styled.div<{ $isDeveloperMode: boolean }>`
  border: 3px solid green;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: black;

  ${({ $isDeveloperMode }) =>
    $isDeveloperMode &&
    css`
      border: 3px solid red;
    `}
`;

const AlignLeft = styled.div``;

const AlignCenter = styled.div`
  // These are just to make the developer button clickable even when it's not visible
  & > div {
    min-width: 100px;
    min-height: 1.5rem;
  }
`;

const AlignRight = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 0 10px;
`;

const TopBarBody = styled(Body)`
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export function TopBar({
  fullScreenHandle: handle,
}: {
  fullScreenHandle: FullScreenHandle;
}) {
  const { user, logout } = useUser();
  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);

  useEffect(() => {
    if (barRef.current) {
      setBarHeight(barRef.current.offsetHeight);
    }
  }, [barRef]);

  const toggleFullScreenHandle = handle.active ? handle.exit : handle.enter;

  const isDeveloperMode = useDeveloperMode();

  return (
    <>
      <StyledBar ref={barRef} $isDeveloperMode={isDeveloperMode}>
        <ItemContainer>
          <AlignLeft>
            <TopBarBody onClick={toggleFullScreenHandle}>
              {/* <FullScreenIcon /> */}
              <Icon name="scale" />
            </TopBarBody>
          </AlignLeft>

          <AlignCenter>
            <DeveloperModeButton>
              <TopBarBody>{user ? `@${user?.name}` : ' '}</TopBarBody>
            </DeveloperModeButton>
          </AlignCenter>

          <AlignRight>
            <TopBarBody onClick={() => setLeaderboardModalOpen(true)}>
              <Icon name="trophy" />
            </TopBarBody>
            <LeaderboardModal
              isOpen={leaderboardModalOpen}
              onClose={() => setLeaderboardModalOpen(false)}
            />
            <TopBarBody onClick={() => setHelpModalOpen(true)}>
              <Icon name="questionmark" />
            </TopBarBody>
            <HelpModal
              isOpen={helpModalOpen}
              onClose={() => setHelpModalOpen(false)}
            />
            {user !== undefined && isDeveloperMode && (
              <TopBarBody onClick={() => logout()}>
                <Icon name="logout" />
              </TopBarBody>
            )}
          </AlignRight>
        </ItemContainer>
      </StyledBar>
      <Spacing y={barHeight} />
    </>
  );
}
