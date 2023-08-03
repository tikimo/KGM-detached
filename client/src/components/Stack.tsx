import styled from 'styled-components';

type StackProps = {
  axis?: 'x' | 'y';
  spacing?: number;
};

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${(props) => (props.axis === 'x' ? 'row' : 'column')};
  > * + * {
    margin-left: ${(props) => (props.axis === 'x' ? props.spacing : 0)}px;
    margin-top: ${(props) => (props.axis === 'y' ? props.spacing : 0)}px;
  }
`;

Stack.defaultProps = {
  axis: 'y',
  spacing: 0,
};
