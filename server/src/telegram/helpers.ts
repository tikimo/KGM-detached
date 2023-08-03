export const seededRandomNumber = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = (Math.abs(hash) % 1000) / 1000; // Generate a number between 0 and 1
  return random;
};
