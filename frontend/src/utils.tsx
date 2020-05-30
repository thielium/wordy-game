export const DIFFICULTY_MAP: { [key: string]: string } = {
  1: 'easy',
  2: 'medium',
  3: 'hard',
};
export const USED_WORDS = 'usedWords';

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
