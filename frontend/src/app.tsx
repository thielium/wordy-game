import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import yaml from 'yaml';
import { Options } from './options';
import { DIFFICULTY_MAP, localStorageName } from './utils';

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
    const usedWords = JSON.parse(localStorage.getItem(localStorageName(difficulty)) || '[]');

    // There's a better way to do this, but the probability of encountering a used word
    // is so low, that the inefficiencies here are negligible
    let newWord = possibleWords[chosenWordIndex];

    const originalIndex = chosenWordIndex;
    while (usedWords.includes(newWord)) {
      chosenWordIndex++;
      if (chosenWordIndex >= possibleWords.length) chosenWordIndex = 0;
      newWord = possibleWords[chosenWordIndex];

      if (chosenWordIndex === originalIndex) {
        console.log('Aborting as all possible words were used');
        return;
      }
    }
    setCurrentWord(newWord);
    usedWords.push(newWord);
    localStorage.setItem(localStorageName(difficulty), JSON.stringify(usedWords));
  };

  const Home = () => {
    if (difficulty) {
      // Check if all words have been used
      const possibleWords = wordList[difficulty];
      const usedWords = JSON.parse(localStorage.getItem(localStorageName(difficulty)) || '[]');
      if (possibleWords.length === usedWords.length) {
        // TODO - all words used!
        return (
          <>
            <h1 style={{ fontSize: 40, textTransform: 'capitalize' }}>
              All words used. You must REALLY like this game!
            </h1>
            <button onClick={() => setDifficulty(null)}>Home</button>
          </>
        );
      }

      // Displays word of the previously selected difficulty
      const nextTitle = `Next ${DIFFICULTY_MAP[difficulty]} Word`;
      return (
        <>
          <div>
            <h2>The {DIFFICULTY_MAP[difficulty]} word is:</h2>
            <h1 style={{ fontSize: 40, textTransform: 'capitalize' }}>{currentWord}</h1>
            <h2>{localStorage.getItem(localStorageName(difficulty))}</h2> {/* TOOD: Delete this line */}
          </div>
          <button onClick={() => setNewWord(difficulty)}>{nextTitle}</button>

          <br />
          <button onClick={() => setDifficulty(null)}>Home</button>
          <br />
        </>
      );
    } else {
      // Allows user to select word difficulty
      const buttons: React.ReactFragment[] = [];

      // TODO: CHANGE <br /> to Vertical Stacking
      for (const diffIndex in DIFFICULTY_MAP) {
        const buttonTitle = `${DIFFICULTY_MAP[diffIndex]} Word`;
        buttons.push(
          <React.Fragment key={diffIndex}>
            <button onClick={() => setNewWord(parseInt(diffIndex))}>{buttonTitle}</button>
            <br />
          </React.Fragment>,
        );
      }
      return (
        <>
          <h1>Home Menu</h1>
          <div>
            <h2>Select Difficulty</h2>
            {buttons}
          </div>
          <Link to="/options">
            <button type="button">Options</button>
          </Link>
        </>
      );
    }
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
