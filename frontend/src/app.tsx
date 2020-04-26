// TODOs:
// * Add Used Words List
// * Add template page?

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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

  setNewWord(difficulty: number | null): void {
    if (difficulty === null) throw new Error('difficulty level is "null" in "setNewWord"');
    this.setState({ difficulty });
    var possibleWords = this.state.wordList[difficulty];
    let chosenWordIndex = Math.floor(possibleWords.length * Math.random());
    const usedWords = JSON.parse(localStorage.getItem(USED_WORDS) || '[]');

    // There's a better way to do this, but the probability of encountering a used word
    // is so low, that the inefficiencies here are negligible
    let newWord = possibleWords[chosenWordIndex];

    const originalIndex = chosenWordIndex;
    while (usedWords.includes(newWord)) {
      // TODO - debug with chrome debugger in VSCode
      console.log(chosenWordIndex);
      console.log(newWord);

      chosenWordIndex++;
      if (chosenWordIndex === originalIndex) {
        throw new Error('All words used. You must REALLY like this game!');
      }
      if (chosenWordIndex >= possibleWords.length) chosenWordIndex = 0;
      newWord = possibleWords[chosenWordIndex];
    }
    this.setState({ currentWord: newWord });
    usedWords.push(newWord);
    localStorage.setItem(USED_WORDS, JSON.stringify(usedWords));
  }

  clearUsedWords(): void {
    localStorage.removeItem(USED_WORDS);
    // TODO - UI confirmation that usedWords was deleted
  }

  importUsedWords = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          localStorage.setItem(USED_WORDS, JSON.parse(reader.result));
        }
      };
      reader.readAsText(event.target.files[0]);
    }
  };

  exportUsedWords(): void {
    const ephemeralElement = document.createElement('a');
    const usedWords = JSON.stringify(localStorage.getItem(USED_WORDS) || '[]');
    ephemeralElement.href = URL.createObjectURL(new Blob([usedWords], { type: 'application/json' }));
    ephemeralElement.download = 'usedWords.json';
    document.body.appendChild(ephemeralElement); // Required for FireFox
    ephemeralElement.click();
  }

  Home = () => {
    if (this.state.difficulty) {
      // Displays word of the previously selected difficulty
      return (
        <>
          <div>
            The {DIFFICULTY_MAP.get(this.state.difficulty)} word is:
            <div className="word-to-guess">{this.state.currentWord}</div>
            <div>{localStorage.getItem(USED_WORDS)}</div>
          </div>
          <button onClick={() => this.setNewWord(this.state.difficulty)} style={{ textTransform: 'capitalize' }}>
            Next {DIFFICULTY_MAP.get(this.state.difficulty)} Word
          </button>
          <br />
          <button onClick={() => this.setState({ difficulty: null })}>Home</button>
          <br />
        </>
      );
    } else {
      // Allows user to select word difficulty
      const buttons: React.ReactFragment[] = [];

      // TODO: CHANGE <br /> to Vertical Stacking

      // Array.from(...) due to: https://github.com/microsoft/TypeScript/issues/11209#issuecomment-303152976
      for (let diffInteger of Array.from(DIFFICULTY_MAP.keys())) {
        buttons.push(
          <>
            <button onClick={() => this.setNewWord(diffInteger)} style={{ textTransform: 'capitalize' }}>
              {DIFFICULTY_MAP.get(diffInteger)} Word
            </button>
            <br />
          </>,
        );
      }
      return (
        <>
          <div>Home Menu</div>
          <div>
            <div>Select Difficulty</div>
            {buttons}
          </div>
          <Link to="/options">
            <button type="button">Options</button>
          </Link>
        </>
      );
    }
  };

  Options = () => {
    return (
      <div>
        <div>Game Options</div>
        <button onClick={() => this.clearUsedWords()}>Clear Used Word List</button>
        <br />

        {/* TODO: Clean this up!!!! */}
        <div className="button">
          <label htmlFor="upload-input">
            <button
              onClick={() => {
                document.getElementById('upload-input')?.click();
              }}
            >
              Import Used Word List
            </button>
          </label>
          <input
            type="file"
            onChange={this.importUsedWords}
            id="upload-input"
            style={{
              display: 'none',
            }}
          />
        </div>
        <button onClick={() => this.exportUsedWords()}>Export Used Word List</button>
        <br />
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    );
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <this.Home />
          </Route>
          <Route path="/options">
            <this.Options />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default Game;
