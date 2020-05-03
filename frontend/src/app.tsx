// TODOs:
// * Add template page?

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import yaml from 'yaml';
import './app.css';

const USED_WORDS = 'usedWords';
const DIFFICULTY_MAP = new Map<number, string>([
  [1, 'easy'],
  [2, 'medium'],
  [3, 'hard'],
]);

// TODO: 304 redirects!!!

const Game = () => {
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null); // Actually an integer: 1, 2, or 3
  const [wordList, setWordList] = useState<string[]>([]);

  useEffect(() => {
    const readWordList = async () => {
      let resp = await fetch('http://localhost:9000/');
      setWordList(yaml.parse(await resp.text()));
    };
    readWordList();
  }, []);

  const setNewWord = (difficulty: number | null): void => {
    if (difficulty === null) throw new Error('difficulty level is "null" in "setNewWord"');
    setDifficulty(difficulty);
    var possibleWords = wordList[difficulty];
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
    setCurrentWord(newWord);
    usedWords.push(newWord);
    localStorage.setItem(USED_WORDS, JSON.stringify(usedWords));
  };

  const clearUsedWords = (): void => {
    localStorage.removeItem(USED_WORDS);
    // TODO - UI confirmation that usedWords was deleted
  };

  const importUsedWords = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const exportUsedWords = (): void => {
    const ephemeralElement = document.createElement('a');
    const usedWords = JSON.stringify(localStorage.getItem(USED_WORDS) || '[]');
    ephemeralElement.href = URL.createObjectURL(new Blob([usedWords], { type: 'application/json' }));
    ephemeralElement.download = 'usedWords.json';
    document.body.appendChild(ephemeralElement); // Required for FireFox
    ephemeralElement.click();
  };

  const Home = () => {
    if (difficulty) {
      // Displays word of the previously selected difficulty
      return (
        <>
          <div>
            The {DIFFICULTY_MAP.get(difficulty)} word is:
            <div className="word-to-guess">{currentWord}</div>
            <div>{localStorage.getItem(USED_WORDS)}</div>
          </div>
          <button onClick={() => setNewWord(difficulty)} style={{ textTransform: 'capitalize' }}>
            Next {DIFFICULTY_MAP.get(difficulty)} Word
          </button>
          <br />
          <button onClick={() => setDifficulty(null)}>Home</button>
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
            <button onClick={() => setNewWord(diffInteger)} style={{ textTransform: 'capitalize' }}>
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

  const Options = () => {
    return (
      <div>
        <div>Game Options</div>
        <button onClick={() => clearUsedWords()}>Clear Used Word List</button>
        <br />

        <p> TODO: Clean this up!!!! </p>
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
            onChange={importUsedWords}
            id="upload-input"
            style={{
              display: 'none',
            }}
          />
        </div>
        <button onClick={() => exportUsedWords()}>Export Used Word List</button>
        <br />
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    );
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/options">
          <Options />
        </Route>
      </Switch>
    </Router>
  );
};

export default Game;
