import styled, { css } from 'styled-components';
import { GamePlayer as GamePlayerType } from '../../../../shared/types.shared';
import playerPng from '../../../assets/images/pixelville.png';
import busPng from '../../../assets/images/bus.png';
import { seededRandomNumber } from '../../../components/utils';
import { MAP_FONT_SIZE } from '../../../utils/map-font-size';
import { useDebounce } from 'usehooks-ts';

export const CHARACTER_BASE_STYLES = css<{ name?: string; uuid: string }>`
  width: auto;
  aspect-ratio: 1 / 1;
  /* touch-action: none; */
  /* pointer-events: none; */
  image-rendering: pixelated;

  /* background: url(${playerPng}) no-repeat center; */
  /* background-size: 100% 100%;
  background-size: contain;

  image-rendering: pixelated; */
  /* transition: all 1s ease-in-out; */

  // random hue shift
  ::after {
    content: '';
    z-index: -1;
    /* border: 1px solid white; */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;

    width: auto;
    aspect-ratio: 1 / 1;
    touch-action: none;
    pointer-events: none;

    background: url(${playerPng}) no-repeat center;
    background-size: 100% 100%;
    background-size: contain;

    image-rendering: pixelated;
    filter: hue-rotate(${({ uuid }) => seededRandomNumber(uuid) * 360}deg);
  }

  ${({ name }) =>
    name &&
    css`
      ::before {
        content: '${name}';
        /* margin-top: -0.7rem; */
        transform: translateY(-120%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        ${MAP_FONT_SIZE}

        font-weight: bold;
        text-shadow: 0 0 0.5rem black;
      }
    `}
`;

const MapPlayerContainer = styled.div<{ x: number; y: number; speed: number }>`
  position: absolute;

  top: ${({ y }) => y}%;
  left: ${({ x }) => x}%;
  height: 3%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -100%);
  /* transform: translateX(200%); */
  /* border: 1px solid red; */
  transition: all ${({ speed }) => 1 / speed}s ease-in-out;
  pointer-events: none;
`;

export const Character = styled.div<{
  x: number;
  y: number;
  uuid: string;
}>`
  position: relative;
  /* position: absolute;
  top: ${({ y }) => y}%;
  left: ${({ x }) => x}%;
  height: 3%;
  transform: translate(-50%, -100%); */
  /* border: 1px solid green; */
  width: 100%;
  height: 100%;
  /* transform: translate(-25%, 0%); */

  /* transition: all 1s ease-in-out; */

  /* animation: jump 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  // random starting point for the animation
  animation-delay: ${({ uuid }) => seededRandomNumber(uuid) * 1}s;

  @keyframes jump {
    0% {
      transform: translateY(0%);
    }
    60% {
      transform: translateY(-5%);
    }
    90% {
      transform: translateY(0%);
    }
  } */

  ${CHARACTER_BASE_STYLES}
`;

export const StaticCharacter = styled.div<{
  name: string;
  size: string;
  mode?: string;
  uuid: string;
}>`
  margin-top: ${({ size }) => css`calc(${size} / 3)`};
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  ${CHARACTER_BASE_STYLES}
  ::before {
    font-size: ${({ size }) => css`calc(${size} / 10)`};
  }

  ${({ mode }) =>
    mode === 'winner' &&
    css`
      // animate 3 rotation flipping
      animation: winningAnimation 0.5s linear infinite alternate;
      @keyframes winningAnimation {
        // jumping from left to right
        0% {
          transform: translate(-6%, 0%) rotate(3deg);
        }
        50% {
          transform: translate(0%, -10%) rotate(0deg);
        }
        100% {
          transform: translate(6%, 0%) rotate(-3deg);
        }
      }
    `}
`;

export const GamePlayer = ({ player }: { player: GamePlayerType }) => {
  const { location, speed, name, guild, uuid, statusList } = player;
  const { x, y } = location;

  const debouncedStatusList = useDebounce(statusList, 1000 / speed);

  const isInBus = debouncedStatusList.includes('bus');

  return (
    <MapPlayerContainer x={x} y={y} speed={speed}>
      <Character x={x} y={y} uuid={uuid}>
        {/* {name} */}
        {isInBus && <Bus speed={speed} />}

        <PlayerInfo>
          {statusList.length > 0 && <div>{statusList.join(' ')}</div>}
          <div>{`[${guild}]`}</div>
          <div>{name}</div>
        </PlayerInfo>
      </Character>
    </MapPlayerContainer>
  );
};

const Bus = styled.div<{ speed: number }>`
  position: absolute;
  background: url(${busPng}) no-repeat center;
  background-size: cover;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  aspect-ratio: 1.5;

  // height is 48/34 as percentage
  height: calc(48 / 34 * 100%);
  /* height: 120%;  */

  /* background: rgba(0, 0, 0, 0.5); */
  /* border: 1px solid white; */
  // animation drive from left
  animation: busAnimation 1s ease-out;
  @keyframes busAnimation {
    0% {
      opacity: 0;
      transform: translate(-250%, -50%);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const PlayerInfo = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(-50%, -100%);

  ${MAP_FONT_SIZE}
  color: white;
  // all child elements
  & > div {
    background: rgba(0, 0, 0, 0.5);
    padding: 0 0.2rem;
    white-space: nowrap;
  }
  /* border: 1px solid red; */

  /* ::before {
    content: 'asddddd';
    transform: translateY(-120%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    ${MAP_FONT_SIZE}

    font-weight: bold;
    text-shadow: 0 0 0.5rem black;
  } */
`;
