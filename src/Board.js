import React, { Component } from "react";
import Cell from "./Cell";

class Board extends Component {
  constructor() {
    super();
    this.state = {
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      initial: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ],
      statusText: "",
      timer: 0
    };
  }

  validate = board => {
    let isValid = true;
    for (let i = 0; i < 4; i++) {
      const horizontal = new Set();
      const vertical = new Set();
      const square = new Set();
      for (let j = 0; j < 4; j++) {
        horizontal.add(board[i][j]);
        vertical.add(board[j][i]);
        square.add(
          board[2 * (i % 2) + (j % 2)][
            2 * Math.floor(i / 2) + Math.floor(j / 2)
          ]
        );
      }
      horizontal.delete(0);
      vertical.delete(0);
      square.delete(0);
      if (horizontal.size !== 4 || vertical.size !== 4 || square.size !== 4) {
        isValid = false;
      }
    }
    return isValid;
  };

  restartBoard = () => {
    fetch(
      "https://us-central1-skooldio-courses.cloudfunctions.net/react_01/random"
    )
      .then(res => {
        return res.json();
      })
      .then(jsonResponse => {
        console.log(jsonResponse);
        this.setState({
          board: jsonResponse.board,
          timer: 0,
          initial: jsonResponse.board.map(row =>
            row.map(item => (item !== 0 ? true : false))
          )
        });
      });
  };

  onSubmit = () => {
    const isValid = this.validate(this.state.board);
    if (isValid) clearInterval(this.interval);
    this.setState({
      statusText: isValid ? "You made it!!!" : "Please try again"
    });
  };

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState({ timer: this.state.timer + 1 }),
      1000
    );
    this.restartBoard();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <p className="timer">Elapsed Time: {this.state.timer} second(s)</p>
        <div className="board">
          {this.state.board.map((row, i) =>
            row.map((number, j) => (
              <Cell
                key={`cell-${i}-${j}`}
                isInitial={this.state.initial[i][j]}
                number={number}
                onChange={number => {
                  const { board } = this.state;
                  board[i][j] = number;
                  this.setState({ board });
                }}
              />
            ))
          )}
        </div>
        <button className="restart-button" onClick={this.restartBoard}>
          Restart
        </button>
        <button onClick={this.onSubmit}>Submit</button>
        <p>{this.state.statusText}</p>
      </div>
    );
  }
}

export default Board;
