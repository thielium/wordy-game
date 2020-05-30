import cogoToast from 'cogo-toast';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { allLocalStorageNames } from './utils';

const clearUsedWords = (): void => {
  allLocalStorageNames().forEach((lsKey) => {
    localStorage.removeItem(lsKey);
  });
  cogoToast.success('Used word list cleared');
};

const importUsedWords = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        console.log(reader.result);
        const allUsedWords = JSON.parse(reader.result);
        allLocalStorageNames().forEach((lsKey) => {
          localStorage.setItem(lsKey, allUsedWords[lsKey] || []);
        });
      }
    };
    reader.readAsText(event.target.files[0]);
  }
};

const exportUsedWords = (): void => {
  let allUsedWords: { [key: string]: string } = {};
  allLocalStorageNames().forEach((lsKey) => {
    const someUsedWords = localStorage.getItem(lsKey);
    if (someUsedWords) {
      allUsedWords[lsKey] = someUsedWords;
    }
  });
  if (_.isEmpty(allUsedWords)) {
    cogoToast.error('Word list is empty');
    return;
  }
  console.log(JSON.stringify(allUsedWords));
  const ephemeralElement = document.createElement('a');
  ephemeralElement.href = URL.createObjectURL(new Blob([JSON.stringify(allUsedWords)], { type: 'application/json' }));
  ephemeralElement.download = 'usedWords.json';
  document.body.appendChild(ephemeralElement); // Required for FireFox
  ephemeralElement.click();
};

export const Options = () => {
  return (
    <View>
      <Text>Game Options</Text>
      <Button title="Clear Used Word List" onPress={() => clearUsedWords()} />
      <br />

      <div className="button">
        <label htmlFor="upload-input">
          <button onClick={importUsedWords}>Activate Lasers</button>
          <Button title="Import Used Word List" onPress={() => importUsedWords} />
        </label>
      </div>
      <br />
      <Button title="Export Used Word List" onPress={() => exportUsedWords()} />
      <br />
      <Link to="/">
        <button type="button">Home</button>
      </Link>
    </View>
  );
};
