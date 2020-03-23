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
    this.readWordList();
    console.log(this.state.wordList);
  }

  readWordList() {
    fetch('http://localhost:9000/users')
      .then(res => res.text())
      .then(res => this.setState({ wordList: res }));
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
            Level {this.state.difficulty} word here! ({
              this.state.wordList // TODO
              // JSON.stringify(new Date())
            })
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
