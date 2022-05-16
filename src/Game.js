import './App.css';
import { useRef, useState } from 'react';
import { searchTileForSimulation, placePlayerTile, tilesAvailableForPlayer, disablePlayerHand } from './Util';

function Game(props) {

  const DELAY = 2000;
  let leftLeaf = useRef(-1);
  let rightLeaf = useRef(-1);
  let gameBlocked = useRef(0);
  let gameOver = useRef(false);

  const [table, setTable] = useState([]);
  const [player1, setPlayer1] = useState(props.data.player1);
  const [player2, setP2] = useState(props.data.player2);
  const [player3, setP3] = useState(props.data.player3);
  const [player4, setP4] = useState(props.data.player4);

function timeout() {
  return new Promise( res => setTimeout(res, DELAY) );
}

function getTileHandIndex(tile){
  for (let i = 0; i < player1.length; i++){
    if (player1[i].id === tile.id) {
      return i;
    }
  }
}

function playerSubmitsAction(tile) {
  console.log('Player plays tile:', tile);

  let tileIndex = getTileHandIndex(tile);
  player1.splice(tileIndex, 1);
  if (table.length === 0){
    tile.isStartingTile = true;
    leftLeaf.current = tile.leftValue;
    rightLeaf.current = tile.rightValue;
    table.push(tile);
    setTable([...table]);
    setPlayer1([...player1]);
    simulateOtherPlayersTurn();
  }
  else{
    let updatedPlayStatus = placePlayerTile(tile, leftLeaf.current, rightLeaf.current, table);
    leftLeaf.current = updatedPlayStatus.tile.leftLeaf !== null ? updatedPlayStatus.tile.leftLeaf : leftLeaf.current;
    rightLeaf.current = updatedPlayStatus.tile.rightLeaf !== null ? updatedPlayStatus.tile.rightLeaf : rightLeaf.current;
    setTable([...updatedPlayStatus.table]);
    setPlayer1([...disablePlayerHand(player1)]);
    if (player1.length === 0){
      gameOver.current = true;
      console.log('GAME IS OVER');
    }
    else{
      simulateOtherPlayersTurn();
    }
  }
}

function getPlayerHand(turn) {
  return turn === 1 ? player2 : turn === 2 ? player3 : player4;
}

function updateHandData(turn, hand){
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

async function simulateOtherPlayersTurn(){
  let turn = 1;
  while (turn < 4) {
    await timeout();
    let simulationturn = searchTileForSimulation(getPlayerHand(turn), leftLeaf.current, rightLeaf.current, table);
      if (simulationturn.blocked) {
        console.log(`Player ${turn} passes the turn`);
        gameBlocked.current += 1;
        if (gameBlocked.current === 4) {
          console.error("Game is blocked. No more available moves");
          gameOver.current = true;
          break;
        }
      } else {
        gameBlocked.current = 0;
        leftLeaf.current = simulationturn.tile.leftLeaf !== null ? simulationturn.tile.leftLeaf : leftLeaf.current;
        rightLeaf.current = simulationturn.tile.rightLeaf !== null ? simulationturn.tile.rightLeaf : rightLeaf.current;
        setTable([...simulationturn.table]);
        updateHandData(turn, simulationturn.hand);
        if (simulationturn.hand.length === 0){
          console.log('Game is Over');
          gameOver.current = true;
          break;
        }
      }
      turn += 1;
  }
  if (!gameOver.current){
    let playerTurnCheck = tilesAvailableForPlayer(player1, leftLeaf.current, rightLeaf.current);
    setPlayer1([...playerTurnCheck.playerHand]);
    if (playerTurnCheck.blocked) {
      gameBlocked.current += 1;
      simulateOtherPlayersTurn();
    }
    else{
      //we need to insert dummy button on the board at the ends
      //so player can have the option of playing on either side
    }
  }
}

  return (
    <div>
        <div
          style={{
            backgroundColor: '#282c34',
            width: '1450px',
            height: '800px',
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div
          style={{
            backgroundColor: '#282c34',
            width: '300px',
            height: '50px',
            position: 'absolute', left: '50%', top: '95%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {player1.map(function(object){
            return <button onClick={() => playerSubmitsAction(object)} disabled={!object.enabled} style={{width:'30px', height:'50px', marginRight:'5px'}} key={object.name}>{object.name}</button>;
          })}
        </div>
        <div
          style={{
            backgroundColor: '#282c34',
            width: '300px',
            height: '50px',
            position: 'absolute', left: '95%', top: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)'
          }}
        div>
          {player2.map(function(object, i){
            return <button disabled={!object.enabled} style={{width:'30px', height:'50px',  marginRight:'5px'}} key={object.name}>{object.name}</button>;
          })}
        </div>
        <div style={{
            backgroundColor: '#282c34',
            width: '300px',
            height: '50px',
            position: 'absolute', left: '50%', top: '5%',
            transform: 'translate(-50%, -50%)'
          }}>
          {player3.map(function(object, i){
            return <button disabled={!object.enabled} style={{width:'30px', height:'50px',  marginRight:'5px'}} key={object.name}>{object.name}</button>;
          })}
        </div>
        <div
          style={{
            backgroundColor: '#282c34',
            width: '300px',
            height: '50px',
            textAlign: 'center',
            position: 'absolute', left: '5%', top: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)'
          }}
        >
        {player4.map(function(object, i){
            return <button disabled={!object.enabled} style={{width:'30px', height:'50px',  marginRight:'5px'}} key={object.name}>{object.name}</button>;
          })}
        </div>
        <div style={{
            backgroundColor: 'white',
            width: '1200px',
            height: '600px',
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
        <div style={{top: '50%', left:'0', right:'0',position: 'fixed', marginRight: 'auto', marginLeft:'auto'}}>
        {table.map(function(object){
            return object.leftValue !== object.rightValue ?
            <button disabled={!object.enabled} style={{width:'50px', height:'30px', background:object.isStartingTile ? '#90ee90' : null }} key={object.name}>{object.name}</button>
            : <button disabled={!object.enabled} style={{width:'30px', height:'50px', background:object.isStartingTile ? '#90ee90' : null }} key={object.name}>{object.name}</button>;
          })}
        </div>
        </div>
    </div>
  );
}

export default Game;