import styled from 'styled-components';
import { Guild } from '../../shared/types.shared';
import { GUILD_IMAGES } from '../utils/guilds-images';

type Props = {
  guild: Guild;
};

export function GreenGuildImage({ guild }: Props) {
  const imageSrc = GUILD_IMAGES[guild];
  return <GuildImage src={imageSrc} />;
}

const GuildImage = styled.img`
  image-rendering: pixelated;
  aspect-ratio: 1/1;
  flex: 1;
  width: 100%;
  height: auto;

  // prettier-ignore
  filter: 
  grayscale(100%) 
  invert() 
  brightness(100%) 
  sepia(50%) 
  hue-rotate(60deg)
  saturate(450%);
`;
