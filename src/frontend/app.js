import React from 'react';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: null,
      difficulty: null,
      wordList: null,
    };
    this.state.wordList = this.readWordList();
  }

  readWordList() {
    // TODO
  }

  getNewWord(difficulty) {
    this.setState({ difficulty });
    if (difficulty) this.setState({ word: JSON.stringify(new Date()) });
  }

  render() {
    if (this.state.difficulty) {
      return (
        <>
          <div>
            Level {this.state.difficulty} word here! ({JSON.stringify(new Date())})
          </div>
          <button onClick={() => this.getNewWord(this.state.difficulty)}>Next Word</button>
          <br />
          <button onClick={() => this.setState({ difficulty: null })}>Main Menu</button>
          <br />
        </>
      );
    } else {
      return (
        <>
          <button onClick={() => this.getNewWord(1)}>Easy Word</button>
          <br />
          <button onClick={() => this.getNewWord(2)}>Medium Word</button>
          <br />
          <button onClick={() => this.getNewWord(3)}>Hard Word</button>
          <br />
        </>
      );
    }
  }
}

export default Game;
