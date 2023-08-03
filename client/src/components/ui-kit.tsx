import styled, { css } from 'styled-components';

type BodySize = 'xsmall' | 'small' | 'medium' | 'large';

const FONT_SIZES: { [key in BodySize]: string } = {
  xsmall: '1rem',
  small: '1.2rem',
  medium: '1.8rem',
  large: '2.2rem',
};

export const Body = styled.div<{
  variant?: 'filled';
  size?: BodySize;
  color?: string;
  display?: string;
}>`
  color: ${(props) => props.color ?? '#1aff00'};
  font-size: ${(props) => FONT_SIZES[props.size ?? 'medium']};
  display: ${(props) => props.display ?? 'block'};
  /* font-family: ErbosOpen; */
`;

export const Input = styled.input<{ color?: string }>`
  border: 2px solid #1aff00;
  color: ${(props) => props.color ?? '#1aff00'};
  font-size: 1.8rem;
  background-color: black;
  padding: 10px;

  &:focus {
    border-radius: 0;
  }
`;

export const Button = styled.button<{
  mode?: 'attention';
  size?: 'small' | 'medium' | 'large';
}>`
  background-color: transparent;
  border: 2px solid #1aff00;
  color: #1aff00;

  font-size: 1.8rem;
  padding: 0.5rem;
  ${({ size }) =>
    size === 'small' &&
    css`
      font-size: 1.2rem;
      padding: 0.2rem;
    `}
  ${({ size }) =>
    size === 'large' &&
    css`
      font-size: 2.2rem;
      padding: 0.8rem;
    `}
  
  
  text-transform: uppercase;
  box-shadow: 4px 4px darkgreen;

  &:hover {
    background-color: darkgreen;
    cursor: pointer;
  }
  &:hover:disabled {
    background-color: transparent;
  }

  &:disabled {
    opacity: 0.5;
    color: darkgreen;
    pointer-events: none;
  }

  // loading gradient animation from left to right
  ${({ mode }) =>
    mode == 'attention' &&
    css`
      // do not show if disabled
      &:not(:disabled) {
        background-image: linear-gradient(
          120deg,
          transparent,
          #1aff0044,
          transparent
        );
        background-size: 400% 400%;
        animation: gradient 1.5s linear infinite forwards;

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      }
    `}
`;

export const Header = styled.h1`
  color: #1aff00;
  font-size: 2.5rem;
  /* font-family: ErbosOpen; */
`;

export const Title = styled.span`
  color: #1aff00;
  font-size: 2.5rem;
  line-height: 1;
  /* font-family: ErbosOpen; */
`;

const formatSize = (size: number | string | undefined) => {
  if (typeof size === 'number') {
    return size + 'px';
  }
  if (typeof size === 'string') {
    return size;
  }
  return '0px';
};

export const Spacing = styled.div<{ x?: number | string; y?: number | string }>`
  width: ${(props) => formatSize(props.x)};
  height: ${(props) => formatSize(props.y)};
`;

export const Row = styled.div<{
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify ?? 'flex-start'};
`;

export const Container = styled.div`
  max-width: 60%;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 90%;
  }
`;
