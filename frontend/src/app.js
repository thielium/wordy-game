import React from 'react';
import yaml from 'yaml';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: null,
      difficulty: null,
    };
  }

  async readWordList() {
    let resp = await fetch('http://localhost:9000/');
    return yaml.parse(await resp.text());
  }

  async componentDidMount() {
    this.setState({wordList: await this.readWordList()});
  }

  getNewWord(difficulty) {
    this.setState({ difficulty });
    console.log(`Game State => ${JSON.stringify(this.state)}`);
    if (difficulty) this.setState({ word: this.state.wordList[difficulty][0] });
  }

  render() {
    if (this.state.difficulty) {
      return (
        <>
          <div>
            Level {this.state.difficulty} word here! ({
              this.state.word
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
