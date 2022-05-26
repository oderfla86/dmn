import { useRef, useState } from "react";
import Board from "./Board";
import Player from "./Player";
import {
  searchTileForSimulation,
  placePlayerTile,
  tilesAvailableForPlayer,
  disablePlayerHand,
  updatePlayerSelectedTile,
  createBoardPlaceholderTiles,
} from "../Util";

function Game(props) {
  const p1_styles = {
    backgroundColor: "transparent",
    width: "320px",
    height: "60px",
    position: "absolute",
    left: "50%",
    top: "93%",
    transform: "translate(-50%, -50%)",
  };

  const p2_styles = {
    backgroundColor: "transparent",
    width: "250px",
    height: "50px",
    position: "absolute",
    left: "97%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(90deg)",
  };

  const p3_styles = {
    backgroundColor: "transparent",
    width: "250px",
    height: "50px",
    position: "absolute",
    left: "50%",
    top: "5%",
    transform: "translate(-50%, -50%)",
  };

  const p4_styles = {
    backgroundColor: "transparent",
    width: "300px",
    height: "50px",
    textAlign: "center",
    position: "absolute",
    left: "3%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(90deg)",
  };

  const DELAY = 1000;
  let leftLeaf = useRef(-1);
  let rightLeaf = useRef(-1);
  let gameBlocked = useRef(0);
  let selectedTile = useRef(null);

  const [table, setTable] = useState([]);
  const [player1, setPlayer1] = useState(props.data.player1);
  const [player2, setP2] = useState(props.data.player2);
  const [player3, setP3] = useState(props.data.player3);
  const [player4, setP4] = useState(props.data.player4);
  const [isPlayer1Blocked, setPlayer1Blocked] = useState(false);
  const [isPlayer2Blocked, setPlayer2Blocked] = useState(false);
  const [isPlayer3Blocked, setPlayer3Blocked] = useState(false);
  const [isPlayer4Blocked, setPlayer4Blocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  function timeout() {
    return new Promise((res) => setTimeout(res, DELAY));
  }

  function getTileHandIndex(tile) {
    for (let i = 0; i < player1.length; i++) {
      if (player1[i].id === tile.id) {
        return i;
      }
    }
  }

  function boardTilePressed(tile) {
    //leftValue -1 left side clicked
    //leftValue -2 right side clicked
    gameBlocked.current = 0;
    let updatedPlayStatus = placePlayerTile(
      selectedTile.current,
      leftLeaf.current,
      rightLeaf.current,
      table,
      tile.leftValue === -1 ? true : false
    );
    leftLeaf.current =
      updatedPlayStatus.tile.leftLeaf !== null
        ? updatedPlayStatus.tile.leftLeaf
        : leftLeaf.current;
    rightLeaf.current =
      updatedPlayStatus.tile.rightLeaf !== null
        ? updatedPlayStatus.tile.rightLeaf
        : rightLeaf.current;
    let tileIndex = getTileHandIndex(selectedTile.current);
    player1.splice(tileIndex, 1);
    setTable([...updatedPlayStatus.table]);
    setPlayer1([...disablePlayerHand(player1)]);
    if (player1.length === 0) {
      setIsGameOver(true);
      console.log("GAME IS OVER");
    } else {
      simulateOtherPlayersTurn();
    }
  }

  function playerPlaysTile(tile) {
    console.log("Player plays tile:", tile);

    let tileIndex = getTileHandIndex(tile);
    if (table.length === 0) {
      player1.splice(tileIndex, 1);
      tile.isStartingTile = true;
      leftLeaf.current = tile.leftValue;
      rightLeaf.current = tile.rightValue;
      table.push(tile);
      setTable([...table]);
      setPlayer1([...player1]);
      simulateOtherPlayersTurn();
    } else {
      setPlayer1([...updatePlayerSelectedTile(tile, player1)]);
      selectedTile.current = tile;
      setTable([...createBoardPlaceholderTiles(table, tile)]);
    }
  }

  function getPlayerHand(turn) {
    return turn === 1 ? player2 : turn === 2 ? player3 : player4;
  }

  function updateHandData(turn, hand) {
    switch (turn) {
      case 1:
        setP2([...hand]);
        break;
      case 2:
        setP3([...hand]);
        break;
      case 3:
        setP4([...hand]);
        break;
      default:
        break;
    }
  }

  async function simulateOtherPlayersTurn() {
    let turn = 1;
    while (turn < 4) {
      await timeout();
      let simulationturn = searchTileForSimulation(
        getPlayerHand(turn),
        leftLeaf.current,
        rightLeaf.current,
        table
      );
      if (simulationturn.blocked) {
        console.log(`Player ${turn} passes the turn`);
        switch (turn) {
          case 1:
            setPlayer2Blocked(true);
            await timeout();
            setPlayer2Blocked(false);
            break;
          case 2:
            setPlayer3Blocked(true);
            await timeout();
            setPlayer3Blocked(false);
            break;
          case 3:
            setPlayer4Blocked(true);
            await timeout();
            setPlayer4Blocked(false);
            break;
          default:
            break;
        }

        gameBlocked.current += 1;
        if (gameBlocked.current === 4) {
          console.error("Game is blocked. No more available moves");
          setIsGameOver(true);
          break;
        }
      } else {
        gameBlocked.current = 0;
        leftLeaf.current =
          simulationturn.tile.leftLeaf !== null
            ? simulationturn.tile.leftLeaf
            : leftLeaf.current;
        rightLeaf.current =
          simulationturn.tile.rightLeaf !== null
            ? simulationturn.tile.rightLeaf
            : rightLeaf.current;
        setTable([...simulationturn.table]);
        updateHandData(turn, simulationturn.hand);
        if (simulationturn.hand.length === 0) {
          console.log("Game is Over");
          setIsGameOver(true);
          break;
        }
      }
      turn += 1;
    }
    if (!isGameOver) {
      let playerTurnCheck = tilesAvailableForPlayer(
        player1,
        leftLeaf.current,
        rightLeaf.current
      );
      setPlayer1([...playerTurnCheck.playerHand]);
      if (playerTurnCheck.blocked) {
        setPlayer1Blocked(true);
        await timeout();
        setPlayer1Blocked(false);
        gameBlocked.current += 1;
        simulateOtherPlayersTurn();
      }
    }
  }

  return (
    <div>
      <div
        style={{
          background: "#7393B3",
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <Player
        style={p1_styles}
        isPlayer={true}
        hand={player1}
        playerPlaysTile={playerPlaysTile}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer1Blocked}
      />
      <Player
        style={p2_styles}
        isPlayer={false}
        hand={player2}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer2Blocked}
        tileStyle={{ width: "30px", height: "50px", marginRight: "5px" }}
        blockedStyle={{
          backgroundColor: "#36454F",
          textAlign: "center",
          borderRadius: "5px",
          color: "white",
          width: "70px",
          height: "30px",
          position: "absolute",
          left: "97%",
          top: "25%",
          transform: "translate(-50%, -50%)",
          opacity: isPlayer2Blocked ? "1" : "0",
          transition: "all 1s",
          visibility: isPlayer2Blocked ? "visible" : "hidden",
        }}
      />
      <Player
        style={p3_styles}
        isPlayer={false}
        hand={player3}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer3Blocked}
        tileStyle={{ width: "30px", height: "50px", marginRight: "5px" }}
        blockedStyle={{
          backgroundColor: "#36454F",
          textAlign: "center",
          borderRadius: "5px",
          color: "white",
          width: "70px",
          height: "30px",
          position: "absolute",
          left: "65%",
          top: "5%",
          transform: "translate(-50%, -50%)",
          opacity: isPlayer3Blocked ? "1" : "0",
          transition: "all 1s",
          visibility: isPlayer3Blocked ? "visible" : "hidden",
        }}
      />
      <Player
        style={p4_styles}
        isPlayer={false}
        hand={player4}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer4Blocked}
        tileStyle={{ width: "30px", height: "50px", marginRight: "5px" }}
        blockedStyle={{
          backgroundColor: "#36454F",
          textAlign: "center",
          borderRadius: "5px",
          color: "white",
          width: "70px",
          height: "30px",
          position: "absolute",
          left: "3%",
          top: "25%",
          transform: "translate(-50%, -50%)",
          opacity: isPlayer4Blocked ? "1" : "0",
          transition: "all 1s",
          visibility: isPlayer4Blocked ? "visible" : "hidden",
        }}
      />
      <Board table={table} boardTilePressed={boardTilePressed} />
    </div>
  );
}

export default Game;
