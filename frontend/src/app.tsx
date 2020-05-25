// TODOs:
// * Add template page?

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import yaml from 'yaml';
import './app.css';
import { Options, USED_WORDS } from './options';
import { Button, Text, View } from 'react-native';

const DIFFICULTY_MAP = new Map<number, string>([
  [1, 'easy'],
  [2, 'medium'],
  [3, 'hard'],
]);

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

  const Home = () => {
    if (difficulty) {
      // Displays word of the previously selected difficulty
      const nextTitle = `Next ${DIFFICULTY_MAP.get(difficulty)} Word`;
      return (
        <>
          <View>
            The {DIFFICULTY_MAP.get(difficulty)} word is:
            <Text style={{ fontSize: 40, textTransform: 'capitalize' }}>{currentWord}</Text>
            <Text>{localStorage.getItem(USED_WORDS)}</Text>
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

      // Array.from(...) due to: https://github.com/microsoft/TypeScript/issues/11209#issuecomment-303152976
      for (let diffInteger of Array.from(DIFFICULTY_MAP.keys())) {
        const buttonTitle = `${DIFFICULTY_MAP.get(diffInteger)} Word`;
        buttons.push(
          <>
            <Button title={buttonTitle} onPress={() => setNewWord(diffInteger)} />
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
