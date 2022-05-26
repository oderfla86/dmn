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
    this.isSelected = false;
    this.canPlayLeft = false;
    this.canPlayRight = false;
  }
}

let player1 = [];
let player2 = [];
let player3 = [];
let player4 = [];
let tilePool = [];
let table = [];

const reducer = (prev, curr) => prev + curr;

export function createGame() {
  console.log("Initialising game data");
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

function startGame() {
  return {
    table: table,
    player1: player1,
    player2: player2,
    player3: player3,
    player4: player4,
  };
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

export function searchTileForSimulation(
  playerHand,
  leftLeaf,
  rightLeaf,
  table
) {
  let newTile = null;
  let blocked = true;

  for (let i = 0; i < playerHand.length; i++) {
    let handTile = playerHand[i];

    if (handTile.rightValue === leftLeaf || handTile.leftValue === leftLeaf) {
      newTile = handTile;
      newTile.leftLeaf =
        handTile.rightValue === leftLeaf
          ? handTile.leftValue
          : handTile.rightValue;
      newTile.rightLeaf = null;
      newTile.name =
        handTile.rightValue === leftLeaf
          ? handTile.leftValue + ":" + handTile.rightValue
          : handTile.rightValue + ":" + handTile.leftValue;
      playerHand.splice(i, 1);
      table.unshift(newTile);
      blocked = false;
      break;
    } else if (
      handTile.rightValue === rightLeaf ||
      handTile.leftValue === rightLeaf
    ) {
      newTile = handTile;
      newTile.rightLeaf =
        handTile.rightValue === rightLeaf
          ? handTile.leftValue
          : handTile.rightValue;
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
    tile: newTile,
    hand: playerHand,
    table: table,
    blocked: blocked,
  };
}

export function tilesAvailableForPlayer(playerHand, leftLeaf, rightLeaf) {
  let blocked = true;
  for (let i = 0; i < playerHand.length; i++) {
    playerHand[i].canPlayLeft = false;
    playerHand[i].canPlayRight = false;
    if (
      playerHand[i].rightValue !== leftLeaf &&
      playerHand[i].leftValue !== leftLeaf &&
      playerHand[i].rightValue !== rightLeaf &&
      playerHand[i].leftValue !== rightLeaf
    ) {
      playerHand[i].enabled = false;
    } else {
      playerHand[i].enabled = true;
      if (
        playerHand[i].rightValue === leftLeaf ||
        playerHand[i].leftValue === leftLeaf
      ) {
        playerHand[i].canPlayLeft = true;
      }
      if (
        playerHand[i].rightValue === rightLeaf ||
        playerHand[i].leftValue === rightLeaf
      ) {
        playerHand[i].canPlayRight = true;
      }
      blocked = false;
    }
  }
  console.log(playerHand);
  return {
    playerHand: playerHand,
    blocked: blocked,
  };
}

export function disablePlayerHand(playerHand) {
  for (let i = 0; i < playerHand.length; i++) {
    playerHand[i].enabled = false;
  }
  return playerHand;
}

export function placePlayerTile(
  playerTile,
  leftLeaf,
  rightLeaf,
  table,
  isLeftSideClicked
) {
  removePlaceholderTilesFromBoard(table);
  let newTile = null;

  if (isLeftSideClicked) {
    //we know user wants to play on the left side of the table
    newTile = playerTile;
    newTile.leftLeaf =
      playerTile.rightValue === leftLeaf
        ? playerTile.leftValue
        : playerTile.rightValue;
    newTile.rightLeaf = null;
    newTile.name =
      playerTile.rightValue === leftLeaf
        ? playerTile.leftValue + ":" + playerTile.rightValue
        : playerTile.rightValue + ":" + playerTile.leftValue;
    table.unshift(newTile);
  } else {
    //user clicked on the right side of the table
    newTile = playerTile;
    newTile.rightLeaf =
      playerTile.rightValue === rightLeaf
        ? playerTile.leftValue
        : playerTile.rightValue;
    newTile.leftLeaf = null;
    newTile.name =
      playerTile.rightValue === rightLeaf
        ? playerTile.rightValue + ":" + playerTile.leftValue
        : playerTile.leftValue + ":" + playerTile.rightValue;
    table.push(newTile);
  }

  return {
    tile: newTile,
    table: table,
  };
}

export function updatePlayerSelectedTile(tile, playerHand) {
  for (let i = 0; i < playerHand.length; i++) {
    if (playerHand[i].id === tile.id) {
      playerHand[i].isSelected = true;
    } else {
      playerHand[i].isSelected = false;
    }
  }
  return playerHand;
}

export function getTileHandIndex(tile, hand) {
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].id === tile.id) {
      return i;
    }
  }
}

export function createBoardPlaceholderTiles(table, tile) {
  table = removePlaceholderTilesFromBoard(table);
  if (tile.canPlayLeft) {
    let t = new Tile(-1, -2);
    table.unshift(t);
  }

  if (tile.canPlayRight) {
    let t = new Tile(-2, -1);
    table.push(t);
  }

  return table;
}

function removePlaceholderTilesFromBoard(table) {
  if (table[0].leftValue < 0) {
    table.splice(0, 1);
  }

  if (table[table.length - 1].leftValue < 0) {
    table.splice(table.length - 1, 1);
  }

  return table;
}

export function calculatePointsForWinners(hand_1, hand_2) {
  debugger;
  const sum_1 = hand_1.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);

  const sum_2 = hand_2.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);

  return sum_1 + sum_2;
}

export function calculateBlockedGameWinner(hand_1, hand_2, hand_3, hand_4) {
  const sum_1 = hand_1.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);

  const sum_2 = hand_2.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);

  const sum_3 = hand_3.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);

  const sum_4 = hand_4.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);

  if (sum_1 + sum_3 > sum_2 > sum_4) {
    return {
      winner: 1,
      points: sum_1 + sum_3,
    };
  } else if (sum_1 + sum_3 < sum_2 > sum_4) {
    return {
      winner: 0,
      points: sum_2 + sum_4,
    };
  } else {
    return {
      winner: -1,
      points: 0,
    };
  }
}
