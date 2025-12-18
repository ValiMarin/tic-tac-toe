import { useState } from "react";
import "./App.css";

function App() {
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  const [player1, setPlayer1Symbol] = useState("X");
  const [player2, setPlayer2Symbol] = useState("O");

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [player1TurnPanel, setPlayer1TurnPanel] = useState(true);
  const [player2TurnPanel, setPlayer2TurnPanel] = useState(false);

  const [boardConfiguration, newBoardConfiguration] = useState(
    Array(9).fill("")
  );
  const [disabled, setDisabled] = useState(Array(9).fill(false));
  const [lastTurn, setLastTurn] = useState("O");

  const [winnablePosition, setWinnablePosition] = useState("none");

  const positionPlayed = (b) => {
    if (b[0] !== "" && b[0] === b[1] && b[0] === b[2]) return "row-0";
    if (b[3] !== "" && b[3] === b[4] && b[3] === b[5]) return "row-1";
    if (b[6] !== "" && b[6] === b[7] && b[6] === b[8]) return "row-2";

    if (b[0] !== "" && b[0] === b[3] && b[0] === b[6]) return "col-0";
    if (b[1] !== "" && b[1] === b[4] && b[1] === b[7]) return "col-1";
    if (b[2] !== "" && b[2] === b[5] && b[2] === b[8]) return "col-2";

    if (b[0] !== "" && b[0] === b[4] && b[0] === b[8]) return "diag-main";
    if (b[2] !== "" && b[2] === b[4] && b[2] === b[6]) return "diag-sec";

    return "none";
  };

  const linePositions = {
    "row-0": { "--line-y": "16.66%", "--rotate": "0deg" },
    "row-1": { "--line-y": "50%", "--rotate": "0deg" },
    "row-2": { "--line-y": "83.33%", "--rotate": "0deg" },

    "col-0": { "--line-x": "16.66%", "--rotate": "90deg" },
    "col-1": { "--line-x": "50%", "--rotate": "90deg" },
    "col-2": { "--line-x": "83.33%", "--rotate": "90deg" },

    "diag-main": { "--rotate": "45deg" },
    "diag-sec": { "--rotate": "-45deg" },
  };

  const [winnerName, setWinnerName] = useState();
  const [winnerPanel, setWinnerPanel] = useState(false);

  const showWinner = () => {
    setWinnerPanel(true);

    setTimeout(() => {
      setWinnerPanel(false);
    }, 1000);
  };

  const gameOver = (winner) => {
    newBoardConfiguration(Array(9).fill(""));
    setDisabled(Array(9).fill(false));

    if (player1 === winner) {
      setPlayer1Score((add) => add + 1);
      setWinnerName(player1Name + " won!");
      addResult(2);
    } else if (player2 === winner) {
      setPlayer2Score((add) => add + 1);
      setWinnerName(player2Name + " won!");
      addResult(1);
    } else if (winner === "reset") {
      setWinnerName("New Game!");
    } else {
      setWinnerName("Draw!");
      addResult(0);
    }

    setLastTurn("O");
    let swapPlayersSymbol = player1;
    setPlayer1Symbol(player2);
    setPlayer2Symbol(swapPlayersSymbol);

    if (player1 === "O") {
      setPlayer2TurnPanel(false);
      setPlayer1TurnPanel(true);
    } else {
      setPlayer1TurnPanel(false);
      setPlayer2TurnPanel(true);
    }

    setWinnablePosition("none");
    setInvisibleWinningPanel(false);
    showWinner();
  };

  const boardReconfiguration = (index) => {
    const newBoard = [...boardConfiguration];
    newBoard[index] = true;
    if (lastTurn === "X") {
      newBoard[index] = "O";
      setLastTurn("O");
    } else {
      newBoard[index] = "X";
      setLastTurn("X");
    }

    if (player1TurnPanel) {
      setPlayer1TurnPanel(false);
      setPlayer2TurnPanel(true);
    } else {
      setPlayer2TurnPanel(false);
      setPlayer1TurnPanel(true);
    }
    setDisabled(newBoard);
    newBoardConfiguration(newBoard);

    let configurationWon = positionPlayed(newBoard);
    if (configurationWon !== "none") {
      setWinnablePosition(configurationWon);
      setInvisibleWinningPanel(true);

      setTimeout(() => {
        gameOver(newBoard[index]);
      }, 1000);
    } else if (newBoard.every((position) => position !== "")) {
      gameOver("draw");
    }
  };

  const [scoreboard, setScoreboard] = useState([]);
  const results = [
    "rgba(40, 40, 40, 1)",
    "rgb(194, 79, 79)",
    "rgb(79, 194, 108)",
  ];

  const addResult = (result) => {
    setScoreboard([...scoreboard, result]);
  };

  const reset = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    gameOver("reset");
    setScoreboard([]);
  };

  const [invisibleWinningPanel, setInvisibleWinningPanel] = useState(false);

  return (
    <div className="App">
      <header>Tic-Tac-Toe</header>

      {/*Main Container*/}
      <div className="main">
        {/*Player 1*/}
        <div
          className={`player backgroundPlayer1 ${
            !player1TurnPanel ? "inactive" : ""
          }`}
        >
          <input
            type="text"
            value={player1Name}
            maxLength={8}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
          {player1TurnPanel && (
            <label>
              YOUR TURN
              <br /> -- {player1} --
            </label>
          )}
          <p>Score: {player1Score}</p>
        </div>

        {/*Game board*/}
        <div className="board">
          <div
            className="boardButtons"
            style={
              winnablePosition === "none"
                ? { "--line-visible": 0 }
                : { ...linePositions[winnablePosition], "--line-visible": 1 }
            }
          >
            <button
              className="boardButton borderBottom borderRight"
              disabled={disabled[0]}
              onClick={() => boardReconfiguration(0)}
            >
              {boardConfiguration[0]}
            </button>
            <button
              className="boardButton borderBottom borderRight"
              disabled={disabled[1]}
              onClick={() => boardReconfiguration(1)}
            >
              {boardConfiguration[1]}
            </button>
            <button
              className="boardButton borderBottom"
              disabled={disabled[2]}
              onClick={() => boardReconfiguration(2)}
            >
              {boardConfiguration[2]}
            </button>

            <button
              className="boardButton borderBottom borderRight"
              disabled={disabled[3]}
              onClick={() => boardReconfiguration(3)}
            >
              {boardConfiguration[3]}
            </button>
            <button
              className="boardButton borderBottom borderRight"
              disabled={disabled[4]}
              onClick={() => boardReconfiguration(4)}
            >
              {boardConfiguration[4]}
            </button>
            <button
              className="boardButton borderBottom"
              disabled={disabled[5]}
              onClick={() => boardReconfiguration(5)}
            >
              {boardConfiguration[5]}
            </button>

            <button
              className="boardButton borderRight"
              disabled={disabled[6]}
              onClick={() => boardReconfiguration(6)}
            >
              {boardConfiguration[6]}
            </button>
            <button
              className="boardButton borderRight"
              disabled={disabled[7]}
              onClick={() => boardReconfiguration(7)}
            >
              {boardConfiguration[7]}
            </button>
            <button
              className="boardButton"
              disabled={disabled[8]}
              onClick={() => boardReconfiguration(8)}
            >
              {boardConfiguration[8]}
            </button>
          </div>

          {/*Scoreboard*/}
          <div>
            <label>Scoreboard</label>
            <p>
              |
              {scoreboard.map((index) => (
                <span key={index} style={{ color: results[index] }}>
                  l
                </span>
              ))}
              |
            </p>
            <button className="resetBtn" onClick={() => reset()}>
              RESET
            </button>
          </div>
        </div>

        {/*Player 2*/}
        <div
          className={`player backgroundPlayer2 ${
            !player2TurnPanel ? "inactive" : ""
          }`}
        >
          <input
            type="text"
            value={player2Name}
            maxLength={8}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
          {player2TurnPanel && (
            <label>
              YOUR TURN
              <br /> -- {player2} --
            </label>
          )}
          <p>Score: {player2Score}</p>
        </div>
      </div>

      {/*Winner*/}
      {winnerPanel && (
        <div className="playerWonBackground">
          <div className="playerWon">
            <p className="winner">{winnerName}</p>
          </div>
        </div>
      )}

      {invisibleWinningPanel && <div className="invisiblePanel"></div>}
    </div>
  );
}

export default App;
