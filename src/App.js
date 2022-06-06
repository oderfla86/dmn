import { useState } from "react";
import Game from "./components/Game/Game";
import GameBoard from "./components/Game/GameBoard";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [playerId, setplayerId] = useState(null);

  function gameReadyToStart(playerId) {
    setplayerId(playerId);
    setIsLoading(false);
  }
  function createNewHands(round, team1Points, team2Points, currentPlayer) {
    // let newState = createGame();
    // newState.rounds = round + 1;
    // newState.team1Points = team1Points;
    // newState.team2Points = team2Points;
    // newState.startingPlayer = currentPlayer + 1 < 4 ? currentPlayer + 1 : 0;
    // setInitialSate(newState);
    // setIsLoading(true);
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
