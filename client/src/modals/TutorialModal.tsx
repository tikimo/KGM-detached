import { useState } from 'react';
import styled from 'styled-components';
import { Body } from '../components/ui-kit';
import { Icon } from '../icons';
import { useLockBodyScroll } from '../services/useLockBodyScroll';
import { TUTORIAL_IMAGES } from '../utils/tutorial-images';

const SLIDES = [
  {
    id: 1,
    src: TUTORIAL_IMAGES.lobbies,
    title: 'Lobbies',
    description:
      'There are 10 lobbies and each lobby can have 0-1 players from each guild.',
  },
  {
    id: 2,
    src: TUTORIAL_IMAGES.lobby,
    title: 'Lobby',
    description:
      'A lobby requires at least 3 players to start the game. You can start the game when everyone is ready.',
  },
  {
    id: 3,
    src: TUTORIAL_IMAGES.moving,
    title: 'Moving',
    description:
      'You can move to the spaces next to you (light green spaces). The spaces might have special effects!',
  },
  {
    id: 4,
    src: TUTORIAL_IMAGES.winning,
    title: 'Winning',
    description:
      'Player who finds the Gambit first wins the game and gets points for their guild.',
  },
  {
    id: 5,
    src: TUTORIAL_IMAGES.points,
    title: 'Leaderboard',
    description:
      'Open the leaderboard by pressing the button on the top right corner. The leaderboard shows the points of each guild.',
  },
];

export function TutorialModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
}) {
  useLockBodyScroll(isOpen);

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [dontShowAgain] = useState(true);

  if (!isOpen) {
    return null;
  }

  function back() {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((c) => c - 1);
    }
  }

  function next() {
    if (currentSlideIdx < SLIDES.length - 1) {
      setCurrentSlideIdx((c) => c + 1);
    }
  }

  return (
    <TutorialModalWrapper>
      <TutorialModalContent>
        <TutorialModalHeader>
          <AlignLeft>
            {currentSlideIdx > 0 && <Icon name="back" onClick={back} />}
          </AlignLeft>
          {SLIDES[currentSlideIdx].title}
          <AlignRight>
            {currentSlideIdx < SLIDES.length - 1 && (
              <Icon name="next" onClick={next} />
            )}
          </AlignRight>
        </TutorialModalHeader>
        <ScrollableContent>
          <p>{SLIDES[currentSlideIdx].description}</p>
          <Image src={SLIDES[currentSlideIdx].src} />
        </ScrollableContent>
        <TutorialModalFooter>
          <AlignLeft>
            {/* <RowWrapper onClick={() => setDontShowAgain((c) => !c)}>
            <Checkbox type="checkbox" checked={dontShowAgain} readOnly />
            <label className="font-medium text-gray-900">
              Älä näytä uudestaan
            </label>
          </RowWrapper> */}
          </AlignLeft>
          <AlignRight>
            {currentSlideIdx === SLIDES.length - 1 && (
              <CloseButton onClick={() => onClose(dontShowAgain)}>
                Close
              </CloseButton>
            )}
          </AlignRight>
        </TutorialModalFooter>
      </TutorialModalContent>
    </TutorialModalWrapper>
  );
}

const AlignLeft = styled.div`
  align-self: start;
  width: 40px;
`;

const AlignRight = styled.div`
  align-self: right;
  width: 40px;
`;

const Image = styled.img`
  flex: 1;
  width: 60%;
  height: auto;

  border: 3px solid white;
  display: block;
  margin-block: 2rem;
  margin-inline: auto;
`;

const ScrollableContent = styled.div`
  height: 75vh;
  overflow-y: auto;
`;

const TutorialModalWrapper = styled.div`
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

  // fade in time 1s
  animation: tutorialFadeIn 2s;
  @keyframes tutorialFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const TutorialModalContent = styled.div`
  border: 1px solid forestgreen;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  padding: 1rem;
`;

const TutorialModalHeader = styled(Body)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
`;

const TutorialModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

const CloseButton = styled(Body)`
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
