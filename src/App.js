import { useState, useEffect } from "react";
import Game from "./components/Game/Game";
import { createGame } from "./Util";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialSate, setInitialSate] = useState(null);

  useEffect(() => {
    //initial values of the game (round, points, points, startingPlayer)
    createNewHands(-1, 0, 0, -2);
  }, []);

  function createNewHands(round, team1Points, team2Points, currentPlayer) {
    let newState = createGame();
    newState.rounds = round + 1;
    newState.team1Points = team1Points;
    newState.team2Points = team2Points;
    newState.startingPlayer = currentPlayer + 1 < 4 ? currentPlayer + 1 : 0;
    setInitialSate(newState);
    setIsLoading(false);
  }

  return (
    <div>
      {!isLoading ? (
        <Game
          key={new Date().getTime()}
          data={initialSate}
          createNewHands={createNewHands}
        />
      ) : null}
    </div>
  );
}

export default App;
