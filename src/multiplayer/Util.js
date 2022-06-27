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
    this.leftPos = 0;
    this.topPos = 0;
    this.position = "vertical";
    this.isValidLeaf = false;
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
  table[0].isValidLeaf = false;
  table[table.length - 1].isValidLeaf = false;

  return table;
}

function getHandTotalPoints(hand) {
  let total = 0;
  for (let i = 0; i < hand.length; i++) {
    total += hand[i].total;
  }
  return total;
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

export function tilesAvailableForPlayer(
  player,
  leftLeaf,
  rightLeaf,
  currentRound,
  table
) {
  let playerHand = JSON.parse(player.hand);
  let blocked = true;
  for (let i = 0; i < playerHand.length; i++) {
    playerHand[i].canPlayLeft = false;
    playerHand[i].canPlayRight = false;
    //this needs to be modified
    if (currentRound === 0 && table.length === 0) {
      if (playerHand[i].id !== "6:6") {
        playerHand[i].enabled = false;
        blocked = false;
      }
    } else {
      if (table.length === 0) {
        //player can start with any tile
        blocked = false;
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
  isLeftSideClicked,
  leftMargin,
  rightMargin,
  constraints
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
    newTile.image = newTile.name.replace(":", "");
    let updatedTile = setTileBoardPosition(
      leftMargin,
      rightMargin,
      newTile,
      "left",
      table,
      constraints
    );
    newTile = updatedTile.tile;
    leftMargin = updatedTile.leftMargin;
    rightMargin = updatedTile.rightMargin;
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
    newTile.image = newTile.name.replace(":", "");
    let updatedTile = setTileBoardPosition(
      leftMargin,
      rightMargin,
      newTile,
      "right",
      table,
      constraints
    );
    newTile = updatedTile.tile;
    leftMargin = updatedTile.leftMargin;
    rightMargin = updatedTile.rightMargin;
    table.push(newTile);
  }

  return {
    tile: newTile,
    table: table,
    leftMargin: leftMargin,
    rightMargin: rightMargin,
    constraints: constraints,
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

export function createBoardPlaceholderTiles(table, tile) {
  table[0].isValidLeaf = false;
  table[table.length - 1].isValidLeaf = false;

  if (tile.canPlayLeft) {
    table[0].isValidLeaf = true;
  }
  if (tile.canPlayRight) {
    table[table.length - 1].isValidLeaf = true;
  }

  return table;
}

export function calculatePointsForWinners(hand_1, hand_2) {
  const sum_1 = getHandTotalPoints(JSON.parse(hand_1.hand));
  const sum_2 = getHandTotalPoints(JSON.parse(hand_2.hand));

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

export function getStsartingPlayer(listOfPlayers) {
  for (let i = 0; i < listOfPlayers.length; i++) {
    let hand = JSON.parse(listOfPlayers[i].hand);
    if (hand.find((tile) => tile.id === "6:6")) {
      return listOfPlayers[i].id;
    }
  }
}

export function setTileBoardPosition(
  leftMargin,
  rightMargin,
  tile,
  pos,
  table,
  constraints
) {
  //add new constraints object to the logic
  if (tile.leftValue === tile.rightValue) {
    //we know is a double so we fixate the height
    tile.topPos = 207;
    if (tile.isStartingTile) {
      //we put it in the middle and update both margin values
      tile.leftPos = leftMargin - 22; //half the width of the tile
      leftMargin = leftMargin - 22;
      rightMargin = rightMargin + 22;
    } else {
      //we need to know if we are playing in the right or the left of the board (check pos value)
      if (pos === "left") {
        if (!constraints.leftLimitReached) {
          if (leftMargin < 100) {
            constraints.leftLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table,
              constraints
            );
          } else {
            //we play on the left
            leftMargin = leftMargin - 44;
            tile.leftPos = leftMargin;
          }
        } else {
          if (leftMargin < 100) {
            //is the first tile, so needs to be horizontal no matter what
            tile.topPos = constraints.newLeftTop === 121 ? 77 : 98;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 86;
            tile.image = tile.image + "h";
            tile.position = "horizontal";
          } else {
            //we play normal tile in the opposite direction
            tile.topPos = constraints.newLeftTop === 121 ? 56 : 77;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 44;
          }
        }
      } else {
        if (!constraints.rightLimitReached) {
          if (rightMargin > 950) {
            console.log("we need to go down");
            constraints.rightLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table,
              constraints
            );
          } else {
            tile.leftPos = rightMargin;
            rightMargin = rightMargin + 44;
          }
        } else {
          if (rightMargin > 950) {
            //we need to play this horizontally no matter what
            tile.topPos = constraints.newRightTop === 379 ? 379 : 358;
            rightMargin = rightMargin - 86;
            tile.leftPos = rightMargin;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0] + "h";
            tile.position = "horizontal";
          } else {
            tile.topPos = constraints.newRightTop === 379 ? 357 : 336;
            rightMargin = rightMargin - 43;
            tile.leftPos = rightMargin;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
          }
        }
      }
    }
  } else {
    //we know is not a double, so we check first if it's first tile
    tile.topPos = 228;
    if (tile.isStartingTile) {
      leftMargin = leftMargin - 43;
      tile.leftPos = leftMargin;
      rightMargin = rightMargin + 43;
      tile.position = "horizontal";
    } else {
      //we need to know if we are playing in the right or the left of the board (check pos value)
      if (pos === "left") {
        if (!constraints.leftLimitReached) {
          if (leftMargin < 100) {
            console.log("we need to go down");
            constraints.leftLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table,
              constraints
            );
          } else {
            //we play on the left
            leftMargin = leftMargin - 86;
            tile.leftPos = leftMargin;
            tile.position = "horizontal";
          }
        } else {
          if (leftMargin < 100) {
            //is the first tile, so needs to be horizontal no matter what
            tile.topPos = constraints.newLeftTop === 121 ? 77 : 98;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 86;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          } else {
            //we play normal tile in the opposite direction
            tile.topPos = constraints.newLeftTop === 121 ? 77 : 98;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 86;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          }
        }
      } else {
        if (!constraints.rightLimitReached) {
          if (rightMargin > 950) {
            constraints.rightLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table,
              constraints
            );
          } else {
            tile.leftPos = rightMargin;
            rightMargin = rightMargin + 86;
            tile.position = "horizontal";
          }
        } else {
          if (rightMargin > 950) {
            //we need to play this horizontally no matter what
            tile.topPos = constraints.newRightTop === 379 ? 379 : 358;
            rightMargin = rightMargin - 86;
            tile.leftPos = rightMargin;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          } else {
            tile.topPos = constraints.newRightTop === 379 ? 379 : 358;
            rightMargin = rightMargin - 86;
            tile.leftPos = rightMargin;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          }
        }
      }
    }
  }

  return {
    tile: tile,
    leftMargin: leftMargin,
    rightMargin: rightMargin,
    constraints: constraints,
  };
}

export function setTileBoardVerticalPosition(
  leftMargin,
  rightMargin,
  tile,
  pos,
  table,
  constraints
) {
  //we need to know if we are playing in the right or the left of the board (check pos value)
  if (pos === "left") {
    //we play on the left we go up
    if (table[0].leftValue === table[0].rightValue) {
      //tile we are going to attach is a double, values will be different
      tile.topPos = 207 - 86;
      constraints.newLeftTop = 207 - 86;
      tile.leftPos = leftMargin;
      tile.image =
        tile.leftValue === tile.rightValue ? tile.image : tile.image + "v";
      tile.position = "vertical";
    } else {
      tile.topPos = 228 - 86;
      constraints.newLeftTop = 228 - 86;
      tile.leftPos = leftMargin;
      tile.image =
        tile.leftValue === tile.rightValue ? tile.image : tile.image + "v";
      tile.position = "vertical";
    }
  } else {
    if (
      table[table.length - 1].leftValue === table[table.length - 1].rightValue
    ) {
      tile.topPos = 207 + 86;
      constraints.newRightTop = tile.topPos + 86;
      rightMargin = rightMargin - 44;
      tile.leftPos = rightMargin;
      tile.image =
        tile.leftValue === tile.rightValue ? tile.image : tile.image + "v";
      tile.position = "vertical";
    } else {
      tile.topPos = 228 + 44;
      constraints.newRightTop = tile.topPos + 86;
      rightMargin = rightMargin - 44;
      tile.leftPos = rightMargin;
      tile.image =
        tile.leftValue === tile.rightValue ? tile.image : tile.image + "v";
      tile.position = "vertical";
    }
  }

  return {
    tile: tile,
    leftMargin: leftMargin,
    rightMargin: rightMargin,
    constraints: constraints,
  };
}

export function getTotalOfValidPlayers(listOfPlayers) {
  let users = [];
  Object.values(listOfPlayers).forEach((val) => {
    if (val.name !== "dummy") {
      users.push(val);
    }
  });

  return users;
}

export function randomisePlayersTurnOrder(listOfPlayers, gameState) {
  let currentIndex = listOfPlayers.length,
    randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [listOfPlayers[currentIndex], listOfPlayers[randomIndex]] = [
      listOfPlayers[randomIndex],
      listOfPlayers[currentIndex],
    ];
  }

  for (let i = 0; i < listOfPlayers.length; i++) {
    switch (i) {
      case 0:
        listOfPlayers[i].hand = JSON.stringify(gameState.player1);
        break;
      case 1:
        listOfPlayers[i].hand = JSON.stringify(gameState.player2);
        break;
      case 2:
        listOfPlayers[i].hand = JSON.stringify(gameState.player3);
        break;
      case 3:
        listOfPlayers[i].hand = JSON.stringify(gameState.player4);
        break;
      default:
        console.log("Error!");
    }
  }

  return listOfPlayers;
}

export function getLocalOrderOfPlayers(listOfPlayers, playerId) {
  let newOrder = [];
  const index = listOfPlayers.findIndex((player) => {
    return player.id === playerId;
  });

  if (index !== 0) {
    newOrder.push(listOfPlayers[index]);

    for (let i = index + 1; i < listOfPlayers.length; i++) {
      newOrder.push(listOfPlayers[i]);
    }
    for (let i = 0; i < index; i++) {
      newOrder.push(listOfPlayers[i]);
    }

    return newOrder;
  }

  return listOfPlayers;
}

export function updateOriginalOrderArray(originalOrder, player, playerId) {
  for (let i = 0; i < originalOrder.length; i++) {
    if (originalOrder[i].id === playerId) {
      originalOrder[i].hand = JSON.stringify(player);
    }
  }

  return originalOrder;
}
