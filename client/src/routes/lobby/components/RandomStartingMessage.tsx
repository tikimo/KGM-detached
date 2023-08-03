import { useEffect, useState } from 'react';
import { Body } from '../../../components/ui-kit';
import { useTypewriter } from '../../../services/useTypewriter';

const RANDOM_MESSAGES = [
  'Importing new bugs',
  'Loading more socket bugs',
  'Reducing fps',
  'Dropping tables',
  'Implementing bugs',
  'Fetching new vulnerabilities',
  'Experimenting with new security flaws',
  'Deleting useful features',
  'Reducing performance',
  'Adding bad UI elements',
];

export const RandomStartingMessage = () => {
  const [index, setIndex] = useState(0);
  const message = useTypewriter(RANDOM_MESSAGES[index], {
    intervalMs: 50,
    startingDelay: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % RANDOM_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Body>
      {message}
      <AnimatedEllipsis />
      <span>.</span>
    </Body>
  );
};

const AnimatedEllipsis = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % 3);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span>{'.'.repeat(index)}</span>;
};
