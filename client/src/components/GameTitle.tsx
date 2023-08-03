import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Blink } from './Blink';
import { Body } from './ui-kit';

const TitleContainer = styled.div`
  width: 100%;
  padding: min(8%, 5rem) 10%;
  box-sizing: border-box;
  /* border: 2px solid #1aff00; */
`;

export const Title = styled.span`
  color: #1aff00;
  font-size: 3.3rem;
  line-height: 1;
  white-space: pre-line;

  @media (max-width: 500px) {
    font-size: 2.6rem;
  }
`;

type Props = {
  title?: string;
  subtitle?: string;
};

export function GameTitle({
  title = '$:/\nKADONNEEN\nGAMBITIN\nMETSASTYS',
}: Props) {
  return (
    <TitleContainer>
      <Title>
        {title}
        <Blink>_</Blink>
      </Title>
      <RandomSubtitle />
    </TitleContainer>
  );
}

const RANDOM_MESSAGES = [
  'Version: 0.0.0-bug-fix-pls-work',
  "It's not a bug, it's a feature",
  'How many bugs? Yes.',
  "Latest commit: 'feat: add bugs'",
  'console.log("here")',
  'We need you to fix this game :(',
  "Help me, I'm stuck in a loop",
  'Everything can be a feature',
  'We are not responsible for any bugs',
  'Security vulnerabilities: n+1',
  'console.error("rsä")',
  'Can you send someone to fix this shitty game?',
  '(╯°□°）╯︵ ┻━┻',
  'Hopefully you are able to play even once...',
  "Pls don't sue us",
  "Buggy much? That's the point",
  'Brain activity: 0%',
  'Ootko lennättäny leijjaa?',
  'This is not Minecraft',
  'KGM, est. 2022',
  'Juu elikkäs tarkoitus ettiä Gambitti jostai ruudusta',
];

const RANDOM_START_INDEX = Math.floor(Math.random() * RANDOM_MESSAGES.length);

export const RandomSubtitle = () => {
  const [index, setIndex] = useState(RANDOM_START_INDEX);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % RANDOM_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (index % 2 === 0) {
    return <AnimatedBody key={index}>{RANDOM_MESSAGES[index]}</AnimatedBody>;
  }
  return <AnimatedBody key={index}>{RANDOM_MESSAGES[index]}</AnimatedBody>;
};

const AnimatedBody = styled(Body).attrs({
  size: 'small',
  color: 'forestgreen',
})`
  animation: fadeInOut 1s ease-in-out alternate;
  @keyframes fadeInOut {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
