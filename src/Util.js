class Tile {
  constructor(leftValue, rightValue) {
    this.id = leftValue + ":" + rightValue;
    this.name = leftValue + ":" + rightValue;
    this.leftValue = leftValue;
    this.rightValue = rightValue;
    this.total = leftValue + rightValue;
    this.rightLeaf = -1;
    this.leftLeaf = -1;
    this.enabled = true;
    this.isStartingTile = false;
  }
}

let player1 = [];
let player2 = [];
let player3 = [];
let player4 = [];
let tilePool = [];
let table = [];

export function createGame() {
  console.log('Initialising game data');
  player1 = [];
  player2 = [];
  player3 = [];
  player4 = [];
  tilePool = [];
  table = [];

  createTiles();
  shuffleTiles(tilePool);
  dealTilesToPlayers(tilePool);

  return startGame();
}

function createTiles() {
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      let p = new Tile(i, j);
      tilePool.push(p);
    }
  }
}

function shuffleTiles(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function dealTilesToPlayers(arr) {

  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    index += 1;
    if (index > 3) {
      index = index - 4;
    }
    switch (index) {
      case 0:
        player1.push(arr[i]);
        break;
      case 1:
        player2.push(arr[i]);
        break;
      case 2:
        player3.push(arr[i]);
        break;
      case 3:
        player4.push(arr[i]);
        break;
      default:
        console.log("Error!");
    }
  }
}

export function searchTileForSimulation(playerHand, leftLeaf, rightLeaf, table) {
  let newTile = null;
  let blocked = true;

  for (let i = 0; i < playerHand.length; i++) {
    let handTile = playerHand[i];

    if (handTile.rightValue === leftLeaf || handTile.leftValue === leftLeaf) {
      newTile = handTile;
      newTile.leftLeaf = handTile.rightValue === leftLeaf ? handTile.leftValue : handTile.rightValue;
      newTile.rightLeaf = null;
      newTile.name =
        handTile.rightValue === leftLeaf
          ? handTile.leftValue + ":" + handTile.rightValue
          : handTile.rightValue + ":" + handTile.leftValue;
      playerHand.splice(i, 1);
      table.unshift(newTile);
      blocked = false;
      break;
    } else if (handTile.rightValue === rightLeaf || handTile.leftValue === rightLeaf) {
      newTile = handTile;
      newTile.rightLeaf = handTile.rightValue === rightLeaf ? handTile.leftValue : handTile.rightValue;
      newTile.leftLeaf = null;
      newTile.name =
        handTile.rightValue === rightLeaf
          ? handTile.rightValue + ":" + handTile.leftValue
          : handTile.leftValue + ":" + handTile.rightValue;
      playerHand.splice(i, 1);
      table.push(newTile);
      blocked = false;
      break;
    }
  }
  return {
    'tile': newTile,
    'hand': playerHand,
    'table': table,
    'blocked': blocked,
  }
}

export function tilesAvailableForPlayer(playerHand, leftLeaf, rightLeaf) {
  let blocked = true;
  let canPlayLeft = false;
  let canPlayRight = false;
  for (let i = 0; i < playerHand.length; i++) {
    if (playerHand[i].rightValue !== leftLeaf && playerHand[i].leftValue !== leftLeaf && playerHand[i].rightValue !== rightLeaf && playerHand[i].leftValue !== rightLeaf) {
      playerHand[i].enabled = false;
    }
    else {
      playerHand[i].enabled = true;
      if (playerHand[i].rightValue === leftLeaf || playerHand[i].leftLeaf === leftLeaf){
        canPlayLeft = true;
      }
      else{
        canPlayRight = true;
      }
      blocked = false;
    }
  }
  return {
    'playerHand': playerHand,
    'blocked': blocked,
    'canPlayLeft': canPlayLeft,
    'canPlayRight' : canPlayRight,
  }
}

export function disablePlayerHand(playerHand) {
  for (let i = 0; i < playerHand.length; i++) {
    playerHand[i].enabled = false;
  }
  return playerHand;
}

export function placePlayerTile(playerTile, leftLeaf, rightLeaf, table) {

  let newTile = null;
  let blocked = true;

  if (playerTile.rightValue === leftLeaf || playerTile.leftValue === leftLeaf) {
    newTile = playerTile;
    newTile.leftLeaf = playerTile.rightValue === leftLeaf ? playerTile.leftValue : playerTile.rightValue;
    newTile.rightLeaf = null;
    newTile.name =
      playerTile.rightValue === leftLeaf
        ? playerTile.leftValue + ":" + playerTile.rightValue
        : playerTile.rightValue + ":" + playerTile.leftValue;
    table.unshift(newTile);
    blocked = false;
  } else if (playerTile.rightValue === rightLeaf || playerTile.leftValue === rightLeaf) {
    newTile = playerTile;
    newTile.rightLeaf = playerTile.rightValue === rightLeaf ? playerTile.leftValue : playerTile.rightValue;
    newTile.leftLeaf = null;
    newTile.name =
      playerTile.rightValue === rightLeaf
        ? playerTile.rightValue + ":" + playerTile.leftValue
        : playerTile.leftValue + ":" + playerTile.rightValue;
    table.push(newTile);
    blocked = false;
  }
  return {
    'tile': newTile,
    'table': table,
    'blocked': blocked,
  }
}

function startGame() {
  return {
    'table': table,
    'player1': player1,
    'player2': player2,
    'player3': player3,
    'player4': player4
  }
}