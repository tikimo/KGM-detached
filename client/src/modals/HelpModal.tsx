import { Fragment } from 'react';
import styled from 'styled-components';
import { Body, Spacing } from '../components/ui-kit';
import { useLockBodyScroll } from '../services/useLockBodyScroll';

const HELP_CONTENT = new Map<string, string>([
  [
    'General:',
    `KGM is player vs player game. In each game, there can be one representative of each guild. The goal is to find the lost GAMBITTI by moving and discovering the space. The guild, which finds Gambitti wins the round.
    * Small XP bottle: +1 xp
    * Medium XP bottle: +3 xp
    * Large XP bottle: +5 xp
    * Gambitti: +15 xp`
  ],
  [
    'Gameplay:',
    'Players start moving one space at a time (simultaneously) around Yo-kylä. All players see each other and what path has already been discovered.'
  ],
  [
    'Movement:',
    `Players base movement speed is 1 second. Movement can be affected by:
    * E-scooter: +20% MS
    * Glass shards: -20% MS
    * Bus: Teleport to another bus stop
    * Sausage grilling: 10 seconds stall`,
  ],
  [
    'Notable mentions:',
    `Moving to a space that is already occupied starts a Gambitti-kokous. Gambitti-kokous lasts for 10 seconds, during which, neither player can move. After the meeting, the player in space gets drunk for 10 seconds while the meeting starter leaves scratch free. You can use this to your advantage.`,
  ],
]);

export function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  // TODO: Fix help modal not being scrollable on the map view

  return (
    <HelpModalWrapper>
      <HelpModalContent>
        <HelpModalHeader>Help</HelpModalHeader>
        <ScrollableContent>
          {Array.from(HELP_CONTENT.entries()).map(([header, body]) => (
            <Fragment key={header}>
              <HelpModalSubHeader>{header}</HelpModalSubHeader>
              <HelpModalBody>
                <span>{body}</span>
              </HelpModalBody>
              <Spacing y={20} />
            </Fragment>
          ))}
        </ScrollableContent>

        <HelpModalFooter>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </HelpModalFooter>
      </HelpModalContent>
    </HelpModalWrapper>
  );
}

const HelpModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HelpModalContent = styled.div`
  border: 1px solid forestgreen;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  padding: 1rem;
`;

const ScrollableContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
`;

const HelpModalHeader = styled(Body)`
  padding-bottom: 0.5rem;
`;

const HelpModalSubHeader = styled(Body)`
  padding-bottom: 0.5rem;
  font-size: 1.6rem;
`;

const HelpModalBody = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  & > span {
    white-space: pre-wrap;
  }
`;

const HelpModalFooter = styled.div`
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
