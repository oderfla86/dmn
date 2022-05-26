import Game from './components/Game';
import { createGame } from './Util';

function App() {
  
  let initialisedGame = createGame();
  return (
    <div>
      <Game 
        data={initialisedGame}
      />
    </div>
  );
}

export default App;
