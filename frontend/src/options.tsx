import cogoToast from 'cogo-toast';
import { Link } from 'react-router-dom';
import React from 'react';
import { Button, Text, View } from 'react-native';
export const USED_WORDS = 'usedWords';

const clearUsedWords = (): void => {
  localStorage.removeItem(USED_WORDS);
  cogoToast.success('Used word list cleared');
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
  const usedWords = localStorage.getItem(USED_WORDS);
  if (usedWords == null) {
    cogoToast.error('Word list is empty');
    return;
  }
  const ephemeralElement = document.createElement('a');
  ephemeralElement.href = URL.createObjectURL(new Blob([JSON.stringify(usedWords)], { type: 'application/json' }));
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
