import { useRef, useState, useEffect } from "react";
import Board from "../Board/Board";
import Player from "../Player/Player";
import Score from "../Score/Score";
import "../Player/Player.css";
import {
  getLocalOrderOfPlayers,
  disablePlayerHand,
  tilesAvailableForPlayer,
  updateOriginalOrderArray,
  updatePlayerSelectedTile,
  createBoardPlaceholderTiles,
  placePlayerTile,
  calculatePointsForWinners,
  calculateBlockedGameWinner,
  setTileBoardPosition,
} from "../../Util";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, update } from "firebase/database";

function BoardGame(props) {
  const firebaseConfig = {
    apiKey: "AIzaSyA_T3E_8xIgUSf8VUxkEkcMY0S-InUp2Yo",
    authDomain: "dmn-multiplayer.firebaseapp.com",
    databaseURL: "https://dmn-multiplayer-default-rtdb.firebaseio.com",
    projectId: "dmn-multiplayer",
    storageBucket: "dmn-multiplayer.appspot.com",
    messagingSenderId: "209039171258",
    appId: "1:209039171258:web:06b6d6acc30a8a8a936c83",
  };

  const DELAY = 1000;
  let app = useRef(null);
  let db = useRef(null);
  let gameRef = useRef(null);
  let pointsRef = useRef(null);
  let blockedRef = useRef(null);
  let originalOrder = useRef(null);
  let playersOrderLocal = useRef(null);
  let leftLeaf = useRef(-1);
  let rightLeaf = useRef(-1);
  let gameBlockedTotal = useRef(0);
  let team1 = useRef(0);
  let team2 = useRef(0);
  let currentRound = useRef(null);
  let currentTurn = useRef(null);
  let startingPlayer = useRef(null);
  let selectedTile = useRef(null);
  let leftMargin = useRef(0);
  let rightMargin = useRef(0);
  let constraints = useRef({
    leftLimitReached: false,
    rightLimitReached: false,
    newLeftTop: 0,
    newRightTop: 0,
  });

  const [table, setTable] = useState([]);
  const [player1, setP1] = useState([]);
  const [player2, setP2] = useState([]);
  const [player3, setP3] = useState([]);
  const [player4, setP4] = useState([]);
  const [isPlayer1Blocked, setPlayer1Blocked] = useState(false);
  const [isPlayer2Blocked, setPlayer2Blocked] = useState(false);
  const [isPlayer3Blocked, setPlayer3Blocked] = useState(false);
  const [isPlayer4Blocked, setPlayer4Blocked] = useState(false);
  const [team1Points, setTeam1Points] = useState(0);
  const [team2Points, setTeam2Points] = useState(0);
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [player1Name, setP1Name] = useState(null);
  const [player2Name, setP2Name] = useState(null);
  const [player3Name, setP3Name] = useState(null);
  const [player4Name, setP4Name] = useState(null);
  const [isRoundOver, setIsRoundOver] = useState(false);
  //const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    console.log("STARTING GAME");
    app.current = initializeApp(firebaseConfig);
    db.current = getDatabase(app.current);
    gameRef.current = ref(db.current, `game`);
    blockedRef.current = ref(db.current, `blocked`);
    pointsRef.current = ref(db.current, `points`);

    update(gameRef.current, {
      isGameRunning: true,
    });
    update(blockedRef.current, {
      isGameRunning: true,
    });
    update(pointsRef.current, {
      isGameRunning: true,
    });

    onValue(gameRef.current, (snapshot) => {
      //fires whenever a change occurs in game object
      debugger;
      let boardState = snapshot.val();
      if (boardState) {
        setIsRoundOver(boardState.isRoundOver);
        originalOrder.current = JSON.parse(boardState.order);
        playersOrderLocal.current = getLocalOrderOfPlayers(
          JSON.parse(boardState.order),
          props.playerId
        );
        setP1(JSON.parse(playersOrderLocal.current[0].hand));
        setP2(playersOrderLocal.current[1]);
        setP3(playersOrderLocal.current[2]);
        setP4(playersOrderLocal.current[3]);
        setTable(boardState.table ? JSON.parse(boardState.table) : []);

        setP1Name(playersOrderLocal.current[0].name);
        setP2Name(playersOrderLocal.current[1].name);
        setP3Name(playersOrderLocal.current[2].name);
        setP4Name(playersOrderLocal.current[3].name);

        leftMargin.current = boardState.leftMargin;
        rightMargin.current = boardState.rightMargin;
        constraints.current.leftLimitReached = boardState.leftLimitReached;
        constraints.current.rightLimitReached = boardState.rightLimitReached;
        constraints.current.newLeftTop = boardState.newLeftTop;
        constraints.current.newRightTop = boardState.newRightTop;

        if (boardState.isRoundOver) {
          // setIsRoundOver(true);
          if (
            JSON.parse(originalOrder.current[0].hand).length > 0 &&
            JSON.parse(originalOrder.current[1].hand).length > 0 &&
            JSON.parse(originalOrder.current[2].hand).length > 0 &&
            JSON.parse(originalOrder.current[3].hand).length > 0
          ) {
            console.log("Calculating blocked game winner");
            if (props.playerId === currentTurn.current) {
              //only want player that blocked to execute this
              let result = calculateBlockedGameWinner(
                JSON.parse(originalOrder.current[0].hand),
                JSON.parse(originalOrder.current[1].hand),
                JSON.parse(originalOrder.current[2].hand),
                JSON.parse(originalOrder.current[3].hand)
              );
              if (result.winner === 0) {
                team1.current += result.points;
                update(pointsRef.current, {
                  team1Points: team1.current,
                });
              } else {
                if (result.winner === 1) {
                  team2.current += result.points;
                  update(pointsRef.current, {
                    team2Points: team2.current,
                  });
                }
              }
            }
          }
          //we know the round is over, so now we need to set up everything for the next round
          // prepareNextRound();
        } else {
          updateLocalState(boardState);
        }
      }
    });

    onValue(pointsRef.current, (snapshot) => {
      let pointsState = snapshot.val();

      if (pointsState) {
        team1.current = pointsState.team1Points;
        team2.current = pointsState.team2Points;
        setTeam1Name(pointsState.team1Name);
        setTeam2Name(pointsState.team2Name);
        setTeam1Points(pointsState.team1Points);
        setTeam2Points(pointsState.team2Points);
      }
    });

    onValue(blockedRef.current, (snapshot) => {
      let blockedState = snapshot.val();
      gameBlockedTotal.current = blockedState.isGameBlocked;
      if (blockedState) {
        if (blockedState.isPlayerBlocked !== false) {
          playerBlocked(blockedState.isPlayerBlocked);
        }
        if (gameBlockedTotal.current !== 0) {
          if (gameBlockedTotal.current >= 4) {
            //game is blocked so no more plays are allowed
            console.log("game is blocked");
            update(gameRef.current, {
              isRoundOver: true,
            });
          } else {
            if (blockedState.isPlayerBlocked === props.playerId) {
              update(gameRef.current, {
                currentTurn: playersOrderLocal.current[1].id,
              });
            }
          }
        }
      }
    });
  }, []);

  function timeout(time) {
    return new Promise((res) => setTimeout(res, time));
  }

  async function prepareNextRound() {
    if (team1.current >= 100 || team2.current >= 100) {
      console.info("GAME IS FINISHED");
      console.info(`${team1Name} : ${team1.current}`);
      console.info(`${team2Name} : ${team2.current}`);
    } else {
      setIsRoundOver(false);
      props.createNewHands(
        originalOrder.current,
        startingPlayer.current,
        currentRound.current
      );
    }
  }

  async function playerBlocked(playerBlockedId) {
    if (playerBlockedId === props.playerId) {
      setPlayer1Blocked(true);
      await timeout(DELAY);
      setPlayer1Blocked(false);
    } else {
      //different player is blocked, so we need to render the message locally
      for (let i = 1; i < playersOrderLocal.current.length; i++) {
        if (playersOrderLocal.current[i].id === playerBlockedId) {
          switch (i) {
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
        }
      }
    }
  }

  async function updateLocalState(boardState) {
    currentTurn.current = boardState.currentTurn;
    startingPlayer.current = boardState.startingPlayer;
    leftLeaf.current = boardState.leftLeaf;
    rightLeaf.current = boardState.rightLeaf;
    currentRound.current = boardState.round;

    if (boardState.currentTurn === props.playerId) {
      //I'm the only user that can play, so we can search my hand for valid tiles
      let thisPlayer = tilesAvailableForPlayer(
        playersOrderLocal.current[0],
        boardState.leftLeaf,
        boardState.rightLeaf,
        boardState.round,
        boardState.table ? JSON.parse(boardState.table) : []
      );
      if (thisPlayer.blocked) {
        //current player can't play any tiles, so we need to pass the turn and set some values
        update(blockedRef.current, {
          isPlayerBlocked: props.playerId,
          isGameBlocked: gameBlockedTotal.current + 1,
        });
      } else {
        setP1([...thisPlayer.playerHand]);
      }
    } else {
      //I'm the main player but it's not my turn, so need to disable my hand
      let aux_hand = JSON.parse(playersOrderLocal.current[0].hand);
      setP1([...disablePlayerHand(aux_hand)]);
    }
    //disable rest of players hands as well
    // setP2(playersOrderLocal.current[1]);
    // setP3(playersOrderLocal.current[2]);
    // setP4(playersOrderLocal.current[3]);
    // setTable(boardState.table ? JSON.parse(boardState.table) : []);
  }

  function getTileHandIndex(tile) {
    for (let i = 0; i < player1.length; i++) {
      if (player1[i].id === tile.id) {
        return i;
      }
    }
  }

  async function boardTilePressed(tile) {
    if (gameBlockedTotal.current !== 0) {
      console.log("resetting blocked values");
      update(blockedRef.current, {
        isGameBlocked: 0,
        isPlayerBlocked: false,
      });
    }

    let sidePlayed = ""; // "left true, right false"
    if (table.length === 1 && tile.leftValue !== tile.rightValue) {
      sidePlayed = selectedTile.current.canPlayLeft ? true : false;
    } else {
      //revisar si puede jugar por los dos lados en ves de solo la izq
      sidePlayed = tile.id === table[0].id ? true : false;
    }

    let updatedPlayStatus = placePlayerTile(
      selectedTile.current,
      leftLeaf.current,
      rightLeaf.current,
      table,
      sidePlayed,
      leftMargin.current,
      rightMargin.current,
      constraints.current
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
    leftMargin.current = updatedPlayStatus.leftMargin;
    rightMargin.current = updatedPlayStatus.rightMargin;
    constraints.current = updatedPlayStatus.constraints;
    setTable([...updatedPlayStatus.table]);
    setP1([...disablePlayerHand(player1)]);
    if (player1.length === 0) {
      console.log("Round is over");
      //we update the UI for all users
      let updatedOrder = updateOriginalOrderArray(
        originalOrder.current,
        player1,
        props.playerId
      );

      if (
        props.playerId === originalOrder.current[0].id ||
        props.playerId === originalOrder.current[2].id
      ) {
        let points = calculatePointsForWinners(player2, player4);
        // setIsGameOver(true);
        team1.current += points;
        update(pointsRef.current, {
          team1Points: team1.current,
        });
        // prepareNextRound();
      } else {
        let points = calculatePointsForWinners(player2, player4);
        team2.current += points;
        update(pointsRef.current, {
          team2Points: team2.current,
        });
      }
      update(gameRef.current, {
        table: JSON.stringify(table),
        order: JSON.stringify(updatedOrder),
        isRoundOver: true,
      });
    } else {
      // pass the turn for the next user
      let updatedOrder = updateOriginalOrderArray(
        originalOrder.current,
        player1,
        props.playerId
      );
      //we will need to handle in the DB left and right margin values
      update(gameRef.current, {
        leftLeaf: leftLeaf.current,
        rightLeaf: rightLeaf.current,
        table: JSON.stringify(table),
        order: JSON.stringify(updatedOrder),
        leftMargin: leftMargin.current,
        rightMargin: rightMargin.current,
        leftLimitReached: constraints.current.leftLimitReached,
        rightLimitReached: constraints.current.rightLimitReached,
        newLeftTop: constraints.current.newLeftTop,
        newRightTop: constraints.current.newRightTop,
        currentTurn: playersOrderLocal.current[1].id,
      });
    }
  }

  function playerPlaysTile(tile) {
    let tileIndex = getTileHandIndex(tile);
    if (table.length === 0) {
      player1.splice(tileIndex, 1);
      tile.isStartingTile = true;
      tile.isLeaf = true;
      let updatedTile = setTileBoardPosition(
        leftMargin.current,
        rightMargin.current,
        tile,
        null,
        null,
        constraints.current
      );
      table.push(updatedTile.tile);
      leftMargin.current = updatedTile.leftMargin;
      rightMargin.current = updatedTile.rightMargin;
      constraints.current = updatedTile.constraints;
      //need to update original order
      let updatedOrder = updateOriginalOrderArray(
        originalOrder.current,
        player1,
        props.playerId
      );

      update(gameRef.current, {
        leftLeaf: tile.leftValue,
        rightLeaf: tile.rightValue,
        leftMargin: leftMargin.current,
        rightMargin: rightMargin.current,
        leftLimitReached: constraints.current.leftLimitReached,
        rightLimitReached: constraints.current.rightLimitReached,
        newLeftTop: constraints.current.newLeftTop,
        newRightTop: constraints.current.newRightTop,
        table: JSON.stringify(table),
        order: JSON.stringify(updatedOrder),
        currentTurn: playersOrderLocal.current[1].id,
      });
    } else {
      setP1([...updatePlayerSelectedTile(tile, player1)]);
      selectedTile.current = tile;
      setTable([...createBoardPlaceholderTiles(table, tile)]);
    }
  }

  return (
    <div
      style={{
        background: "#767676",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "auto",
        display: "flex",
      }}
    >
      <div
        style={{
          background: "#7393B3",
          width: "1400px",
          height: "750px",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          margin: "auto",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => prepareNextRound()}
          style={{
            backgroundColor: "#90ee90",
            textAlign: "center",
            borderRadius: "5px",
            display: "inline-flex",
            alignSelf: "flex-start",
            color: "black",
            height: "50px",
            width: "100px",
            marginTop: "30px",
            marginRight: "50px",
            visibility: isRoundOver && props.isAdmin ? "visible" : "hidden",
          }}
        >
          NEXT ROUND
        </button>
        <Board table={table} boardTilePressed={boardTilePressed} />
        <Player
          isPlayer={true}
          hand={player1}
          playerPlaysTile={playerPlaysTile}
          isPlayerBlocked={isPlayer1Blocked}
          name={player1Name}
          isHand={startingPlayer.current === props.playerId ? true : false}
          isMyTurn={props.playerId === currentTurn.current ? true : false}
        />
        <Player
          container={"player2_container"}
          playerStyle={"player2"}
          isPlayer={false}
          name={player2Name}
          nameClass={"player2_name"}
          hand={player2.hand ? JSON.parse(player2.hand) : player2}
          isPlayerBlocked={isPlayer2Blocked}
          tileStyle={"player_tile"}
          isRoundOver={isRoundOver}
          blockedClass={"player2_blocked"}
          blockedStyle={{
            opacity: isPlayer2Blocked ? "1" : "0",
            visibility: isPlayer2Blocked ? "visible" : "hidden",
          }}
          handClass={"player2_isHand"}
          isHandStyle={{
            visibility:
              player2.id === startingPlayer.current ? "visible" : "hidden",
          }}
          isMyTurn={
            playersOrderLocal.current !== null
              ? playersOrderLocal.current[1].id === currentTurn.current
                ? true
                : false
              : null
          }
        />
        <Player
          container={"player3_container"}
          playerStyle={"player3"}
          isPlayer={false}
          hand={player3.hand ? JSON.parse(player3.hand) : player3}
          name={player3Name}
          nameClass={"player3_name"}
          isRoundOver={isRoundOver}
          isPlayerBlocked={isPlayer3Blocked}
          tileStyle={"player_tile"}
          blockedClass={"player3_blocked"}
          blockedStyle={{
            opacity: isPlayer3Blocked ? "1" : "0",
            visibility: isPlayer3Blocked ? "visible" : "hidden",
          }}
          handClass={"player3_isHand"}
          isHandStyle={{
            visibility:
              player3.id === startingPlayer.current ? "visible" : "hidden",
          }}
          isMyTurn={
            playersOrderLocal.current !== null
              ? playersOrderLocal.current[2].id === currentTurn.current
                ? true
                : false
              : null
          }
        />
        <Player
          container={"player4_container"}
          playerStyle={"player4"}
          isPlayer={false}
          hand={player4.hand ? JSON.parse(player4.hand) : player4}
          name={player4Name}
          nameClass={"player4_name"}
          isRoundOver={isRoundOver}
          isPlayerBlocked={isPlayer4Blocked}
          tileStyle={"player_tile"}
          blockedClass={"player4_blocked"}
          blockedStyle={{
            opacity: isPlayer4Blocked ? "1" : "0",
            visibility: isPlayer4Blocked ? "visible" : "hidden",
          }}
          handClass={"player4_isHand"}
          isHandStyle={{
            visibility:
              player4.id === startingPlayer.current ? "visible" : "hidden",
          }}
          isMyTurn={
            playersOrderLocal.current !== null
              ? playersOrderLocal.current[3].id === currentTurn.current
                ? true
                : false
              : null
          }
        />
        <Score
          team1Points={team1Points}
          team2Points={team2Points}
          team1Name={team1Name}
          team2Name={team2Name}
        />
      </div>
    </div>
  );
}

export default BoardGame;
