import React from 'react';
import yaml from 'yaml';
import './app.css';

const DIFFICULTY_MAP = new Map<number, string>([
  [1, 'easy'],
  [2, 'medium'],
  [3, 'hard'],
]);

interface GameProps {}
interface GameState {
  word: string | null;
  difficulty: number | null; // Actually an integer: 1, 2, or 3
  wordList: string[];
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      word: null,
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
    this.setState({ word: possibleWords[chosenWordIndex] });
  }

  render() {
    if (this.state.difficulty) {
      return (
        <>
          <div>
            The {DIFFICULTY_MAP.get(this.state.difficulty)} word is:
            <div className="word-to-guess">{this.state.word}</div>
          </div>
          <button onClick={() => this.getNewWord(this.state.difficulty)}>Next Word</button>
          <br />
          <button onClick={() => this.setState({ difficulty: null })}>Main Menu</button>
          <br />
        </>
      );
    } else {
      const buttons: React.ReactFragment[] = [];
      // Array.from(...) due to: https://github.com/microsoft/TypeScript/issues/11209#issuecomment-303152976
      for (let diffInteger of Array.from(DIFFICULTY_MAP.keys())) {
        // TODO https://flaviocopes.com/how-to-uppercase-first-letter-javascript/ | capitalize class
        buttons.push(
          <>
            <button onClick={() => this.getNewWord(diffInteger)}>{DIFFICULTY_MAP.get(diffInteger)} Word</button>
            <br />
          </>,
        );
      }
      return <>{buttons}</>;
    }
  }
}

export default Game;
