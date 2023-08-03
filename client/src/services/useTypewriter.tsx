import { useEffect, useState } from 'react';

// const useTypewriter = (text: string) => {
//   const [displayedText, setDisplayedText] = useState('');
//   useEffect(() => {
//     setDisplayedText('');
//     let i = 0;
//     const interval = setInterval(() => {
//       const char = text?.[i];
//       if (char) {
//         setDisplayedText((prev) => prev + char);
//         i++;
//         return;
//       }
//       i++;
//       if (i >= text.length) {
//         clearInterval(interval);
//       }
//     }, 100);
//     return () => {
//       clearInterval(interval);
//     };
//   }, [text]);
//   return displayedText;
// };
// TODO: Use this later?
export const useTypewriter = (
  inputText: string,
  {
    intervalMs = 100,
    startingDelay = 0,
  }: { intervalMs?: number; startingDelay?: number }
) => {
  const [fullText, setFullText] = useState<string>();
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setDisplayedText('');
      setFullText(inputText);
    }, startingDelay);
  }, [inputText, startingDelay]);

  useEffect(() => {
    if (fullText === undefined) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => {
      clearInterval(interval);
      setFullText(undefined);
      setDisplayedText('');
    };
  }, [fullText]);

  return displayedText;
};
