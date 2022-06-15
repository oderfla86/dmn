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
    this.image = leftValue.toString() + rightValue.toString();
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
    index += 1;
    if (index > 3) {
      index = 0;
    }
  }
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

function getHandTotalPoints(hand) {
  return hand.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);
}

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

export function searchTileForSimulation(
  playerHand,
  leftLeaf,
  rightLeaf,
  table,
  totalRounds
) {
  let newTile = null;
  let blocked = true;
  //we need to add an extra check in here
  if (totalRounds === 0 && table.length === 0) {
    //we know is starting, so we can start with 6:6 or a different tile
    newTile = playerHand.find((tile) => tile.id === "6:6");
    if (newTile) {
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      playerHand = playerHand.filter((tile) => tile.id !== "6:6");
      table.push(newTile);
      blocked = false;
    } else {
      //player doesn't have 6:6, we pick first one
      newTile = playerHand.shift();
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      table.push(newTile);
      blocked = false;
    }
  } else if (totalRounds > 0 && table.length === 0) {
    //we try to find a double, if not, we play the first one
    newTile = playerHand.find((tile) => tile.leftValue === tile.rightValue);
    if (newTile) {
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      playerHand = playerHand.filter((tile) => tile.id !== newTile.id);
      table.push(newTile);
      blocked = false;
    } else {
      newTile = playerHand.shift();
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      table.push(newTile);
      blocked = false;
    }
  } else {
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
        newTile.image = newTile.name.replace(":", "");
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
        newTile.image = newTile.name.replace(":", "");
        playerHand.splice(i, 1);
        table.push(newTile);
        blocked = false;
        break;
      }
    }
  }

  return {
    tile: newTile,
    hand: playerHand,
    table: table,
    blocked: blocked,
  };
}

export function tilesAvailableForPlayer(
  playerHand,
  leftLeaf,
  rightLeaf,
  currentTurn
) {
  let blocked = true;
  for (let i = 0; i < playerHand.length; i++) {
    playerHand[i].canPlayLeft = false;
    playerHand[i].canPlayRight = false;
    if (currentTurn != undefined) {
      if (currentTurn == 0) {
        if (playerHand[i].id !== "6:6") {
          playerHand[i].enabled = false;
          blocked = false;
        }
      }
    } else {
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
  }
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

export function calculatePointsForWinners(hand_1, hand_2) {
  const sum_1 = getHandTotalPoints(hand_1);
  const sum_2 = getHandTotalPoints(hand_2);

  return sum_1 + sum_2;
}

export function calculateBlockedGameWinner(hand_1, hand_2, hand_3, hand_4) {
  const sum_1 = getHandTotalPoints(hand_1);
  const sum_2 = getHandTotalPoints(hand_2);
  const sum_3 = getHandTotalPoints(hand_3);
  const sum_4 = getHandTotalPoints(hand_4);

  if (sum_1 + sum_3 > sum_2 + sum_4) {
    return {
      winner: 1,
      points: sum_1 + sum_3,
    };
  } else if (sum_1 + sum_3 < sum_2 + sum_4) {
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

export function getStsartingPlayer(hand_1, hand_2, hand_3, hand_4) {
  if (hand_1.find((tile) => tile.id === "6:6")) {
    return 0;
  }
  if (hand_2.find((tile) => tile.id === "6:6")) {
    return 1;
  }
  if (hand_3.find((tile) => tile.id === "6:6")) {
    return 2;
  }
  if (hand_4.find((tile) => tile.id === "6:6")) {
    return 3;
  }
}
