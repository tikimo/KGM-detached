import styled from 'styled-components';
import Reload from '../assets/icons/reload.svg';

const ICONS = {
  reload: Reload,
} as const;

type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export const Icon = ({
  name,
  size = 32,
  color = '#00ff00',
  ...props
}: IconProps) => {
  const Icon = ICONS[name];
  return (
    <SvgWrapper color="#ffff00">
      <StyledImg
        src={Icon}
        style={{
          backgroundColor: 'red',
        }}
        color={color}
        height={size}
        width={size}
        {...props}
      ></StyledImg>
    </SvgWrapper>
  );
};

const StyledImg = styled.img<{ color: string }>`
  & > svg {
    color: #0000ff;
    fill: ${({ color }) => color};
    color: ${({ color }) => color};
  }
`;

const SvgWrapper = styled.span<{ color: string }>`
  & > svg {
    fill: ${({ color }) => color};
  }
`;
