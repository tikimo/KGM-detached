import { animated } from '@react-spring/web';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { GamePlayer } from '../../../shared/types.shared';
import MAP_IMAGE from '../../assets/images/map.png';
import { EffectModal } from '../../modals/EffectModal';
import { GameEndedModal } from '../../modals/GameEndedModal';
import { useGame } from '../../services/useGame';
import { useLockBodyScroll } from '../../services/useLockBodyScroll';
import { GameObjects } from './components/GameObjects';
import { Hud } from './components/Hud';
import { Spaces } from './components/Spaces';
import { useMapGestures } from './hooks/useMapGestures';

export function Game() {
  const { endResult, game, ownCharacter } = useGame();
  const [style, ref] = useMapGestures();
  const navigate = useNavigate();
  useLockBodyScroll();

  useEffect(() => {
    if (game) return;

    const t = setTimeout(() => {
      if (game) return;
      navigate('/lobbies');
    }, 5000);

    return () => clearTimeout(t);
  }, [game, navigate]);

  const effectMode = isDrunk(ownCharacter) ? 'drunk' : undefined;

  console.log({ effectMode });

  return (
    <>
      <MapContainer mode={effectMode}>
        <Animated ref={ref} style={style} onClick={printCoordinates}>
          <Map src={MAP_IMAGE} alt="map"></Map>
          <Spaces />
          <GameObjects />
        </Animated>
      </MapContainer>
      <Hud />
      <EffectModal />
      <GameEndedModal endResult={endResult} />
    </>
  );
}

function isDrunk(player?: GamePlayer) {
  return player?.statusList?.find((s) => s === 'drunk') ?? false;
}

const Map = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  touch-action: none;
  // This fixes the dragging bug on desktop
  pointer-events: none;
  opacity: 0.5;
  filter: brightness(1.5);
`;

const MapContainer = styled.div<{ mode?: 'drunk' }>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
  touch-action: none;

  ${({ mode }) =>
    mode === 'drunk' &&
    css`
      ${drunk}
    `}
`;

// drunk keyframes
const drunk = css`
  filter: blur(0px);
  animation: drunkFilter 30s ease-in-out infinite alternate;
  @keyframes drunkFilter {
    0% {
      filter: blur(0px);
      transform: skew(0deg);
    }
    8% {
      filter: blur(12px);
      transform: skew(10deg);
    }
    10% {
      filter: blur(3px);
      transform: skew(20deg);
    }
    11% {
      filter: blur(17px);
      transform: skew(9deg);
    }
    16% {
      filter: blur(0px);
      transform: skew(3deg);
    }
    22% {
      filter: blur(2px);
      transform: skew(0deg);
    }
    35% {
      filter: blur(0px) hue-rotate(0deg);
      transform: skew(-9deg);
    }
    50% {
      filter: blur(1px) hue-rotate(200deg);
      transform: skew(0deg);
    }
    64% {
      filter: blur(0px) hue-rotate(-100deg);
      transform: skew(2deg);
    }
    80% {
      filter: blur(0px) hue-rotate(0deg);
      transform: skew(-2deg);
    }
    88% {
      filter: blur(12px);
      transform: skew(5deg);
    }
    90% {
      filter: blur(-3px);
      transform: skew(0deg);
    }
    92% {
      filter: blur(7px);
      transform: skew(20deg);
    }
    95% {
      filter: blur(0px);
      transform: skew(0deg);
    }
  }
`;

const Animated = styled(animated.div)`
  width: auto;
  height: auto;
  touch-action: none;
  position: relative;
`;

const printCoordinates = (event: React.MouseEvent<HTMLDivElement>) => {
  // Get the dimensions of the element
  const rect = event.currentTarget.getBoundingClientRect();

  // Calculate the relative coordinates
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  // Round the coordinates to one decimal point
  const roundedX = Math.round(x * 1000) / 10;
  const roundedY = Math.round(y * 1000) / 10;

  console.log(`
x: ${roundedX},
y: ${roundedY},`);

  console.log(`

{
  id: '${Math.random().toString(36).substring(7)}',
  x: ${roundedX},
  y: ${roundedY},
  connections: [],
},`);
};
