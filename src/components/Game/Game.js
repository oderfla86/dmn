import { useRef, useState, useEffect } from "react";
import Board from "../Board/Board";
import Player from "../Player/Player";
import Score from "../Score/Score";
import "../Player/Player.css";
import {
  searchTileForSimulation,
  placePlayerTile,
  tilesAvailableForPlayer,
  disablePlayerHand,
  updatePlayerSelectedTile,
  createBoardPlaceholderTiles,
  calculatePointsForWinners,
  calculateBlockedGameWinner,
  getStsartingPlayer,
} from "../../Util";

function Game(props) {
  const DELAY = 1000;
  const ROUND_DELAY = 5000;
  let leftLeaf = useRef(-1);
  let rightLeaf = useRef(-1);
  let gameBlocked = useRef(0);
  let gameOver = useRef(false);
  let selectedTile = useRef(null);
  let totalRounds = useRef(props.data.rounds ? props.data.rounds : 0);
  let team1 = useRef(props.data.team1Points ? props.data.team1Points : 0);
  let team2 = useRef(props.data.team2Points ? props.data.team2Points : 0);

  let startingPlayer = useRef(props.data.startingPlayer);

  const [table, setTable] = useState([...[]]);
  const [player1, setPlayer1] = useState(props.data.player1);
  const [player2, setP2] = useState(props.data.player2);
  const [player3, setP3] = useState(props.data.player3);
  const [player4, setP4] = useState(props.data.player4);
  const [isPlayer1Blocked, setPlayer1Blocked] = useState(false);
  const [isPlayer2Blocked, setPlayer2Blocked] = useState(false);
  const [isPlayer3Blocked, setPlayer3Blocked] = useState(false);
  const [isPlayer4Blocked, setPlayer4Blocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [team1Points, setTeam1Points] = useState(team1.current);
  const [team2Points, setTeam2Points] = useState(team2.current);
  const [isHand, setIsHand] = useState(null);

  useEffect(() => {
    console.log("Getting starting player:", startingPlayer.current);
    if (startingPlayer.current < 0) {
      startingPlayer.current = getStsartingPlayer(
        player1,
        player2,
        player3,
        player4
      );
      setIsHand(startingPlayer.current);
      if (startingPlayer.current !== 0) {
        console.log("Player starting:", startingPlayer.current);
        simulateOtherPlayersTurn(startingPlayer.current);
      } else {
        let playerTurnCheck = tilesAvailableForPlayer(
          player1,
          leftLeaf.current,
          rightLeaf.current,
          totalRounds.current
        );
        setPlayer1([...playerTurnCheck.playerHand]);
      }
    } else {
      setIsHand(startingPlayer.current);
      if (startingPlayer.current !== 0) {
        simulateOtherPlayersTurn(startingPlayer.current);
      } else {
        let playerTurnCheck = tilesAvailableForPlayer(
          player1,
          leftLeaf.current,
          rightLeaf.current,
          totalRounds.current
        );
        setPlayer1([...playerTurnCheck.playerHand]);
        setIsHand(startingPlayer.current);
      }
    }
  }, []);

  function timeout(time) {
    return new Promise((res) => setTimeout(res, time));
  }

  async function prepareNextRound() {
    await timeout(ROUND_DELAY);
    debugger;
    if (team1.current >= 100 || team2.current >= 100) {
      console.info("GAME IS FINISHED");
      console.info("TEAM 1:", team1.current);
      console.info("TEAM 2:", team2.current);
    } else {
      gameOver.current = false;
      setIsGameOver(false);
      console.log("team1Points:", team1.current);
      console.log("team2Points:", team2.current);
      props.createNewHands(
        totalRounds.current,
        team1.current,
        team2.current,
        startingPlayer.current
      );
    }
  }

  function getTileHandIndex(tile) {
    for (let i = 0; i < player1.length; i++) {
      if (player1[i].id === tile.id) {
        return i;
      }
    }
  }

  async function boardTilePressed(tile) {
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
      console.log("Round is over");
      let points = calculatePointsForWinners(player2, player4);
      setIsGameOver(true);
      team1.current = team1Points + points;
      setTeam1Points(team1Points + points);
      prepareNextRound();
    } else {
      simulateOtherPlayersTurn(1);
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
      simulateOtherPlayersTurn(1);
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

  async function simulateOtherPlayersTurn(turn) {
    while (turn < 4) {
      await timeout(DELAY);
      let simulationTurn = searchTileForSimulation(
        getPlayerHand(turn),
        leftLeaf.current,
        rightLeaf.current,
        table,
        totalRounds.current
      );
      if (!simulationTurn.blocked) {
        //player is not blocked, they play a tile
        gameBlocked.current = 0;
        leftLeaf.current =
          simulationTurn.tile.leftLeaf !== null
            ? simulationTurn.tile.leftLeaf
            : leftLeaf.current;
        rightLeaf.current =
          simulationTurn.tile.rightLeaf !== null
            ? simulationTurn.tile.rightLeaf
            : rightLeaf.current;
        setTable([...simulationTurn.table]);
        updateHandData(turn, simulationTurn.hand);
        if (simulationTurn.hand.length === 0) {
          console.log("Rounds is over");
          gameOver.current = true;
          let points = 0;
          if (turn === 1 || turn === 3) {
            //AI won
            points = calculatePointsForWinners(player1, player3);
            team2.current = team2Points + points;
            setTeam2Points(team2Points + points);
            // console.log("team2Points:", team2Points + points);
          } else {
            points = calculatePointsForWinners(player2, player4);
            team1.current = team1Points + points;
            setTeam1Points(team1Points + points);
            // console.log("team1Points:", team1Points + points);
          }

          turn = 5;
        }
        turn += 1;
      } else {
        console.log(`Player ${turn} passes the turn`);
        switch (turn) {
          case 1:
            setPlayer2Blocked(true);
            await timeout(DELAY);
            setPlayer2Blocked(false);
            break;
          case 2:
            setPlayer3Blocked(true);
            await timeout(DELAY);
            setPlayer3Blocked(false);
            break;
          case 3:
            setPlayer4Blocked(true);
            await timeout(DELAY);
            setPlayer4Blocked(false);
            break;
          default:
            break;
        }
        turn += 1;
        gameBlocked.current += 1;
        if (gameBlocked.current >= 4) {
          console.error("Game is blocked. No more available moves");
          let result = calculateBlockedGameWinner(
            player1,
            player2,
            player3,
            player4
          );
          if (result.winner === 0) {
            team1.current = team1Points + result.points;
            setTeam1Points(team1Points + result.points);
            // console.log("team1Points:", team1Points + result.points);
          } else if (result.winner === 1) {
            team2.current = team2Points + result.points;
            setTeam2Points(team2Points + result.points);
            // console.log("team2Points:", team2Points + result.points);
          }

          gameOver.current = true;
          turn = 5;
        }
      }
    }
    if (!gameOver.current) {
      let playerTurnCheck = tilesAvailableForPlayer(
        player1,
        leftLeaf.current,
        rightLeaf.current
      );
      setPlayer1([...playerTurnCheck.playerHand]);
      if (playerTurnCheck.blocked) {
        setPlayer1Blocked(true);
        await timeout(DELAY);
        setPlayer1Blocked(false);
        gameBlocked.current += 1;
        if (gameBlocked.current >= 4) {
          gameOver.current = true;
          console.error("Game is blocked. No more available moves");
          let result = calculateBlockedGameWinner(
            player1,
            player2,
            player3,
            player4
          );
          if (result.winner === 0) {
            team1.current = team1Points + result.points;
            setTeam1Points(team1Points + result.points);
          } else if (result.winner === 1) {
            team2.current = team2Points + result.points;
            setTeam2Points(team2Points + result.points);
          }
          setIsGameOver(gameOver.current);
          prepareNextRound();
        } else {
          simulateOtherPlayersTurn(1);
        }
      }
    } else {
      setIsGameOver(gameOver.current);
      prepareNextRound();
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
      <Score team1Points={team1Points} team2Points={team2Points} />
      <Player
        isPlayer={true}
        hand={player1}
        playerPlaysTile={playerPlaysTile}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer1Blocked}
        isHand={isHand}
      />
      <Player
        style={"player2"}
        isPlayer={false}
        hand={player2}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer2Blocked}
        tileStyle={"player_tile"}
        blockedClass={"player2_blocked"}
        blockedStyle={{
          opacity: isPlayer2Blocked ? "1" : "0",
          visibility: isPlayer2Blocked ? "visible" : "hidden",
        }}
        handClass={"player2_isHand"}
        isHandStyle={{
          visibility: isHand === 1 ? "visible" : "hidden",
        }}
      />
      <Player
        style={"player3"}
        isPlayer={false}
        hand={player3}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer3Blocked}
        tileStyle={"player_tile"}
        blockedClass={"player3_blocked"}
        blockedStyle={{
          opacity: isPlayer3Blocked ? "1" : "0",
          visibility: isPlayer3Blocked ? "visible" : "hidden",
        }}
        handClass={"player3_isHand"}
        isHandStyle={{
          visibility: isHand === 2 ? "visible" : "hidden",
        }}
      />
      <Player
        style={"player4"}
        isPlayer={false}
        hand={player4}
        isGameOver={isGameOver}
        isPlayerBlocked={isPlayer4Blocked}
        tileStyle={"player_tile"}
        blockedClass={"player4_blocked"}
        blockedStyle={{
          opacity: isPlayer4Blocked ? "1" : "0",
          visibility: isPlayer4Blocked ? "visible" : "hidden",
        }}
        handClass={"player4_isHand"}
        isHandStyle={{
          visibility: isHand === 3 ? "visible" : "hidden",
        }}
      />
      <Board table={table} boardTilePressed={boardTilePressed} />
    </div>
  );
}

export default Game;
