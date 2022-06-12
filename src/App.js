import { useState } from "react";
import { createGame } from "./Util";
import GameBoard from "./components/Game/GameBoard";
import Dashboard from "./components/Dashboard/Dashboard";
import { update, ref } from "firebase/database";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [playerId, setplayerId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbRef, setDbRef] = useState(null);

  function gameReadyToStart(playerId, admin, dbRef) {
    setplayerId(playerId);
    setIsAdmin(admin);
    setDbRef(dbRef);
    setIsLoading(false);
  }
  function createNewHands(order, startingPlayer, round) {
    // setIsLoading(true);
    debugger;
    //only admin can execute this part of the code
    if (isAdmin) {
      let newState = createGame(); // contains hands and table values. We need to assign them to each player now, randomly.
      order[0].hand = JSON.stringify(newState.player1);
      order[1].hand = JSON.stringify(newState.player2);
      order[2].hand = JSON.stringify(newState.player3);
      order[3].hand = JSON.stringify(newState.player4);
      round += 1;
      let newStartingPlayer = null;
      for (let i = 0; i < order.length; i++) {
        if (order[i].id === startingPlayer) {
          if (i < 3) {
            newStartingPlayer = order[i + 1].id;
          } else {
            newStartingPlayer = order[0].id;
          }
        }
      }
      let blockedRef = ref(dbRef, `blocked`);
      update(blockedRef, {
        isPlayerBlocked: false,
        isGameBlocked: 0,
      });
      let gameRef = ref(dbRef, `game`);
      update(gameRef, {
        leftLeaf: -1,
        rightLeaf: -1,
        isRoundOver: false,
        isGameOver: false,
        startingPlayer: newStartingPlayer,
        currentTurn: newStartingPlayer,
        order: JSON.stringify(order),
        round: round,
        table: false,
      });
    }
  }

  return (
    <div>
      {!isLoading ? (
        <GameBoard
          key={new Date().getTime()}
          playerId={playerId}
          createNewHands={createNewHands}
        />
      ) : (
        <Dashboard gameReady={gameReadyToStart} />
      )}
    </div>
  );
}

export default App;
