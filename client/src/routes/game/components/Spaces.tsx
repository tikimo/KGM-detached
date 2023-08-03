import styled from 'styled-components';
import { useCharacters } from '../../../services/useCharacters';
import { Space } from './Space';
import {
  GamePlayer,
  Space as SpaceType,
} from '../../../../shared/types.shared';
import { useSpaces } from '../../../services/useSpaces';
import { useEffect } from 'react';

// lazy load spaces from file for development hot reload
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// let DEV_SPACES: any = undefined;
// if (import.meta.env.MODE === 'development') {
//   import('../../../../../server/src/game/Spaces').then((data) => {
//     console.log('DEVELOPMENT: Loading spaces for hot reload');
//     DEV_SPACES = data.SPACES;
//   });
// }

export function Spaces() {
  const { moveOwnCharacter, ownCharacter } = useCharacters();

  const spaces = useSpaces();

  // const validSpaces = new Set(ownCharacter?.location.connections || []);
  // if (ownCharacter?.location.id) {
  //   validSpaces.add(ownCharacter.location.id);
  // }
  const { validIds, highlighIds } = getValidSpaceIdsSet(spaces, ownCharacter);

  useEffect(() => {
    console.log('OWN CHARACTER CHANGED: ', ownCharacter);
  }, [ownCharacter]);
  // if (DEV_SPACES) {
  //   spaces = DEV_SPACES;
  // }

  // sort spaces by y to make them stack in correct order (z race)
  spaces.sort((a, b) => b.y - a.y);

  return (
    <>
      <Svg viewBox={`0 0 100 100`}>
        {spaces.flatMap((space) => {
          return space.connections.map((connection) => {
            const from = spaces.find((s) => s.id === space.id);
            const to = spaces.find((s) => s.id === connection);
            if (!from || !to) return null;

            return (
              <path
                key={`${space.id}-${connection}`}
                d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                style={{
                  stroke: 'forestgreen',
                  opacity: 0.5,
                  strokeWidth: 0.5,
                }}
              />
            );
          });
        })}
      </Svg>
      {spaces.map((space) => {
        // const character = allCharacters.find((p) => p.location === space.name);
        return (
          <Space
            isValidMove={validIds.has(space.id)}
            isHighlighted={highlighIds?.has(space.id)}
            key={space.id}
            space={space}
            onClick={() => {
              moveOwnCharacter(space);
            }}
          />
        );
      })}
    </>
  );
}

const getValidSpaceIdsSet = (spaces: SpaceType[], player?: GamePlayer) => {
  if (!player) return { validIds: new Set<string>() };
  if (player.statusList.includes('bus')) {
    const busSpacesList = spaces
      .filter((s) => s.labels?.includes('bus'))
      .map((s) => s.id);
    const busSpaces = new Set(busSpacesList);
    busSpaces.delete(player.location.id);
    return { validIds: busSpaces, highlighIds: busSpaces };
  }
  const normalMoveSpaces = new Set(player.location.connections);
  normalMoveSpaces.add(player.location.id);
  return { validIds: normalMoveSpaces };
};

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  touch-action: none;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
