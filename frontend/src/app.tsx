import React from 'react';
import yaml from 'yaml';
import './index.css';

const DIFFICULTY_MAP: { [key: string]: string } = {
  1: 'easy',
  2: 'medium',
  3: 'hard',
}

/* const EASY = 1
const MEDIUM = 2
const HARD = 3
*/

interface GameProps {}
interface GameState {
  word: string | null;
  difficulty: string | null;  // Actually an integer: 1, 2, or 3
  wordList?: string[];
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      word: null,
      difficulty: null,
    };
  }

  async readWordList() {
    let resp = await fetch('http://localhost:9000/');
    return yaml.parse(await resp.text());
  }

  async componentDidMount() {
    this.setState({wordList: await this.readWordList()});
  }

  getNewWord(difficulty: string) {
    if (difficulty) this.setState({ difficulty });
    // console.log(`Game State => ${JSON.stringify(this.state)}`);
    const possibleWords = this.state.wordList[difficulty];
    const chosenWordIndex = Math.floor(possibleWords.length * Math.random())
    this.setState({ word: possibleWords[chosenWordIndex] });
  }

  render() {
    if (this.state.difficulty) {
      return (
        <>
          <div>
            The {DIFFICULTY_MAP[this.state.difficulty]} word is: {this.state.word}
          </div>
          <button onClick={() => this.getNewWord(this.state.difficulty)}>Next Word</button>
          <br />
          <button onClick={() => this.setState({ difficulty: null })}>Main Menu</button>
          <br />
        </>
      );
    } else {
      const buttons = [];
      Object.keys(DIFFICULTY_MAP).forEach(diffInteger => {
        // TODO https://flaviocopes.com/how-to-uppercase-first-letter-javascript/ | capitalize class
        buttons.push(
          <>
            <button onClick={() => this.getNewWord(diffInteger)}>{DIFFICULTY_MAP[diffInteger]} Word</button>
            <br />
          </>
        )
      });
      return (
        <>
          {buttons}
        </>
      );
    }
  }
}

export default Game;
