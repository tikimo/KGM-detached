import { useCharacters } from '../../../services/useCharacters';
import { GamePlayer } from './Character';

export function GameObjects() {
  const { characters } = useCharacters();

  return (
    <>
      {characters.map((character) => {
        return <GamePlayer key={character.uuid} player={character} />;
      })}
    </>
  );
}
