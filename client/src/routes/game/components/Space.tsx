import styled, { css } from 'styled-components';
import { Space as SpaceType } from '../../../../shared/types.shared';
import { Icon } from '../../../icons';
import { useDeveloperMode } from '../../../utils/developer-mode';
import { MAP_FONT_SIZE } from '../../../utils/map-font-size';
import BusStopPng from '../../../assets/images/bus-stop.png';
import { useDiscoveredSpaces } from '../../../services/useDiscoveredEffects';
import { DISCOVERY_IMAGES } from '../../../utils/discovery-images';

export function Space({
  space,
  onClick,
  isValidMove,
  isHighlighted,
}: {
  space: SpaceType;
  isValidMove: boolean;
  onClick: () => void;
  isHighlighted?: boolean;
}) {
  const isDeveloperMode = useDeveloperMode();
  const discoveredSpaces = useDiscoveredSpaces((s) => s.discoveredSpaces);
  const isVisited = discoveredSpaces.has(space.id);
  const discovery = discoveredSpaces.get(space.id);

  const discoveryIcon = discovery ? getDiscoveryIcon(discovery) : undefined;

  return (
    <SpaceContainer x={space.x} y={space.y} onClick={onClick}>
      <div>
        <StyledSpace
          $isValidMove={isValidMove}
          $isVisited={isVisited}
          variant={space.name ? 'normal' : 'small'}
        ></StyledSpace>
        {isDeveloperMode && (
          <SpaceLabel className="debug">{space.id}</SpaceLabel>
        )}
        {discovery && discovery !== 'visited' && discoveryIcon && (
          <Discovery
            image={discoveryIcon}
            variant={space.name ? 'normal' : 'small'}
          />
        )}
        {isHighlighted && (
          <HighlightCircle variant={space.name ? 'normal' : 'small'} />
        )}
        {space.labels?.includes('bus') && <BusStop />}
        {space.name && <SpaceLabel>{space.name}</SpaceLabel>}
        {isVisited ? (
          ''
        ) : (
          <QuestionMark
            variant={space.name ? 'normal' : 'small'}
            name="questionmark"
          />
        )}
      </div>
    </SpaceContainer>
  );
}

const QuestionMark = styled(Icon)<{ variant: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50%;
  width: 100%;
  color: black;
  ${({ variant }) =>
    variant === 'small' &&
    css`
      transform: translate(-50%, -50%) scale(0.5);
    `}
`;

// ${({ variant }) =>
// variant === 'small' &&
// css`
//   scale: 0.75;
// `}

const BusStop = styled.div`
  transform: translate(-50%, -80%) scale(0.6);
  background: url(${BusStopPng}) no-repeat center;
  background-size: contain;
  height: 100%;
  aspect-ratio: 1 / 1;
  image-rendering: pixelated;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
`;

const SpaceContainer = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${({ y }) => y}%;
  left: ${({ x }) => x}%;
  width: 3%;
  height: auto;
  aspect-ratio: 1/1;
  cursor: pointer;
  /* background: #1aff00; */
  transform: translate(-50%, -50%);
  /* border: 1px solid red; */
  touch-action: auto;

  & > div {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visible;
  }

  // select child with className debug
  & > div > .debug {
    display: none;
  }
  // on hover show debug
  &:hover > div > .debug {
    display: block;
  }
`;

const StyledSpace = styled.div<{
  variant: string;
  $isValidMove: boolean;
  $isVisited: boolean;
}>`
  width: 100%;
  height: 50%;
  aspect-ratio: 2/1;
  /* transform: translateY(50%); */
  ${({ variant }) =>
    variant === 'small' &&
    css`
      scale: 0.66;
    `}
  background: ${({ $isValidMove }) => getSpaceColor($isValidMove)};
  transition: background 1s;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    position: absolute;
    text-align: center;
    color: black;
    /* height: 50%; */
    height: ${({ variant }) => (variant === 'small' ? '70%' : '40%')};
  }

  // if is valid move, animate popup
  ${({ $isValidMove }) =>
    $isValidMove &&
    css`
      animation: pulse 1s infinite;
    `}
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const getSpaceColor = (isValidMove: boolean) => {
  // if (isValidMove && isVisited) {
  //   return '#5cc250';
  // }
  if (isValidMove) {
    return '#1aff00';
  }

  // if (isVisited) {
  //   return '#1c381c';
  // }
  return '#228b22';
};

const SpaceLabel = styled.div`
  /* transform: translate(-50%, 75%); */
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  /* text-align: center; */
  bottom: -0.2rem;
  white-space: nowrap;
  position: absolute;
  z-index: 10000;
  ${MAP_FONT_SIZE}
  pointer-events: none;
  touch-action: none;
`;

const Discovery = styled.div<{ variant: string; image: string }>`
  /* transform: translate(-50%, 75%); */
  /* position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  white-space: nowrap;

  ${MAP_FONT_SIZE} */

  ${({ variant }) =>
    variant === 'small'
      ? css`
          transform: translate(-50%, -50%) scale(0.4);
        `
      : css`
          transform: translate(-50%, -50%) scale(0.5);
        `}

  background: url(${({ image }) => image}) no-repeat center;
  background-size: contain;
  height: 100%;
  aspect-ratio: 1 / 1;
  image-rendering: pixelated;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
`;

function getDiscoveryIcon(discovery: string) {
  if (discovery in DISCOVERY_IMAGES) {
    return DISCOVERY_IMAGES[discovery];
  }
}

const HighlightCircle = styled.div<{
  variant: string;
}>`
  position: absolute;
  /* top: -0.5rem;
        left: -0.5rem;
        width: calc(100% + 1rem);
        height: calc(100% + 1rem); */
  ${({ variant }) =>
    variant === 'small'
      ? css`
          width: 90%;
          height: 81%;
        `
      : css`
          width: 120%;
          height: 108%;
        `}

  border: 0.3rem solid #ffcc00;

  // animated border
  /* animation: highlightAnimation 1s infinite; */

  border-radius: 50%;
  z-index: 10000;
  pointer-events: none;
  touch-action: none;

  // fade in
  opacity: 0;
  animation: highlightFadeIn 2s forwards, highlightAnimation 1s infinite;
  @keyframes highlightFadeIn {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes highlightAnimation {
    0% {
      border-color: #ffcc00;
    }
    50% {
      border-color: #ffaa0092;
    }
    100% {
      border-color: #ffcc00;
    }
  }
`;
