export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const selectRandomFromArray = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};
