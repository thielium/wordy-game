// TODOs:
// * Add Used Words List
//   * PERSIST USED WORDS in session cookie
//   * Import, Export, and Clear "Used" words list
// * Add template page?

import React from 'react';
import yaml from 'yaml';
import './app.css';

const USED_WORDS = 'usedWords';
const DIFFICULTY_MAP = new Map<number, string>([
  [1, 'easy'],
  [2, 'medium'],
  [3, 'hard'],
]);

interface GameProps {}
interface GameState {
  currentWord: string | null;
  difficulty: number | null; // Actually an integer: 1, 2, or 3
  wordList: string[];
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      currentWord: null,
      difficulty: null,
      wordList: [],
    };
  }

  async readWordList() {
    let resp = await fetch('http://localhost:9000/');
    return yaml.parse(await resp.text());
  }

  async componentDidMount() {
    this.setState({ wordList: await this.readWordList() });
  }

  getNewWord(difficulty: number | null) {
    if (difficulty === null) throw new Error('difficulty level is "null" in "getNewWord"');
    this.setState({ difficulty });
    var possibleWords = this.state.wordList[difficulty];
    const chosenWordIndex = Math.floor(possibleWords.length * Math.random());
    const newWord = possibleWords[chosenWordIndex];

    this.setState({ currentWord: newWord });
    const usedWords = JSON.parse(localStorage.getItem(USED_WORDS) || '[]');
    usedWords.push(newWord);
    localStorage.setItem(USED_WORDS, JSON.stringify(usedWords));
  }

  render() {
    if (this.state.difficulty) {
      // Displays word of the selected difficulty

      // TODO: <div>{localStorage.getItem(USED_WORDS)}</div>    <--- TEMP
      return (
        <>
          <div>
            The {DIFFICULTY_MAP.get(this.state.difficulty)} word is:
            <div className="word-to-guess">{this.state.currentWord}</div>
            <div>{localStorage.getItem(USED_WORDS)}</div>
          </div>
          <button onClick={() => this.getNewWord(this.state.difficulty)} style={{ textTransform: 'capitalize' }}>
            Next {DIFFICULTY_MAP.get(this.state.difficulty)} Word
          </button>
          <br />
          <button onClick={() => this.setState({ difficulty: null })}>Back to Home</button>
          <br />
        </>
      );
    } else {
      // Allows user to select word difficulty
      const buttons: React.ReactFragment[] = [];
      // Array.from(...) due to: https://github.com/microsoft/TypeScript/issues/11209#issuecomment-303152976
      for (let diffInteger of Array.from(DIFFICULTY_MAP.keys())) {
        buttons.push(
          <>
            <button onClick={() => this.getNewWord(diffInteger)} style={{ textTransform: 'capitalize' }}>
              {DIFFICULTY_MAP.get(diffInteger)} Word
            </button>
            <br />
          </>,
        );
      }
      return (
        <>
          <div>Select Difficulty</div>
          {buttons}
        </>
      );
    }
  }
}

export default Game;
