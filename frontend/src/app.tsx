// TODOs:
// * Add template page?

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import yaml from 'yaml';
import './app.css';
import { Options } from './options';
import { DIFFICULTY_MAP, localStorageName } from './utils';
import { Button, Text, View } from 'react-native';

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
      // TODO - debug with chrome debugger in VSCode
      chosenWordIndex++;
      if (chosenWordIndex >= possibleWords.length) chosenWordIndex = 0;
      newWord = possibleWords[chosenWordIndex];

      if (chosenWordIndex === originalIndex) {
        throw new Error('All words used. You must REALLY like this game!');
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
      }

      // Displays word of the previously selected difficulty
      const nextTitle = `Next ${DIFFICULTY_MAP[difficulty]} Word`;
      return (
        <>
          <View>
            The {DIFFICULTY_MAP[difficulty]} word is:
            <Text style={{ fontSize: 40, textTransform: 'capitalize' }}>{currentWord}</Text>
            <Text>{localStorage.getItem(localStorageName(difficulty))}</Text>
          </View>
          <Button title={nextTitle} onPress={() => setNewWord(difficulty)} />

          <br />
          <Button title="Home" onPress={() => setDifficulty(null)} />
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
          <>
            <Button title={buttonTitle} onPress={() => setNewWord(parseInt(diffIndex))} />
            <br />
          </>,
        );
      }
      return (
        <>
          <Text>Home Menu</Text>
          <View>
            <Text>Select Difficulty</Text>
            {buttons}
          </View>
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
