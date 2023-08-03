import styled from 'styled-components';

export const Blink = styled.div`
  animation: blink 1s infinite step-end;
  display: inline-block;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;
