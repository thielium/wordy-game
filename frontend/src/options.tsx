import cogoToast from 'cogo-toast';
import { Link } from 'react-router-dom';
import React from 'react';
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
    <div>
      <div>Game Options</div>
      <button onClick={() => clearUsedWords()}>Clear Used Word List</button>
      <br />

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
