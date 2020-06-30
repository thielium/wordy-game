export const DIFFICULTY_MAP: { [key: string]: string } = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};
const USED_WORDS = 'usedWords';

export const localStorageName = (difficulty: number): string => {
  return `${USED_WORDS}|${DIFFICULTY_MAP[difficulty]}`;
};

export const allLocalStorageNames = (): string[] => {
  const results: string[] = [];
  for (const key in DIFFICULTY_MAP) {
    results.push(localStorageName(parseInt(key)));
  }
  return results;
};
