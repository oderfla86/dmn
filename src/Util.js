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
let leftLimitReached = false;
let rightLimitReached = false;
let newLeftTop = 0;
let newRightTop = 0;

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
  //   if (table[0].leftValue < 0) {
  //     table.splice(0, 1);
  //   }

  //   if (table[table.length - 1].leftValue < 0) {
  //     table.splice(table.length - 1, 1);
  //   }

  //   return table;
}

function getHandTotalPoints(hand) {
  return hand.reduce((accumulator, tile) => {
    return accumulator + tile.total;
  }, 0);
}

export function createGame() {
  console.log("Initialising game data");
  newLeftTop = 0;
  newRightTop = 0;
  leftLimitReached = false;
  rightLimitReached = false;
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
  totalRounds,
  leftMargin,
  rightMargin
) {
  let newTile = null;
  let blocked = true;
  let newLeftMargin = leftMargin;
  let newRightMargin = rightMargin;
  // //we need to add an extra check in here
  if (totalRounds === 0 && table.length === 0) {
    //we know is starting, so we can start with 6:6 or a different tile
    newTile = playerHand.find((tile) => tile.id === "6:6");
    if (newTile) {
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      playerHand = playerHand.filter((tile) => tile.id !== "6:6");
      let updatedTile = setTileBoardPosition(leftMargin, rightMargin, newTile);
      table.push(updatedTile.tile);
      newLeftMargin = updatedTile.leftMargin;
      newRightMargin = updatedTile.rightMargin;
      blocked = false;
    } else {
      //player doesn't have 6:6, we pick first one
      newTile = playerHand.shift();
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      let updatedTile = setTileBoardPosition(leftMargin, rightMargin, newTile);
      table.push(updatedTile.tile);
      newLeftMargin = updatedTile.leftMargin;
      newRightMargin = updatedTile.rightMargin;
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
      let updatedTile = setTileBoardPosition(leftMargin, rightMargin, newTile);
      table.push(updatedTile.tile);
      newLeftMargin = updatedTile.leftMargin;
      newRightMargin = updatedTile.rightMargin;
      blocked = false;
    } else {
      newTile = playerHand.shift();
      newTile.leftLeaf = newTile.leftValue;
      newTile.rightLeaf = newTile.rightValue;
      newTile.isStartingTile = true;
      let updatedTile = setTileBoardPosition(leftMargin, rightMargin, newTile);
      table.push(updatedTile.tile);
      newLeftMargin = updatedTile.leftMargin;
      newRightMargin = updatedTile.rightMargin;
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
        //this tile will be added to the left side
        let updatedTile = setTileBoardPosition(
          leftMargin,
          rightMargin,
          newTile,
          "left",
          table
        );
        newTile = updatedTile.tile;
        newLeftMargin = updatedTile.leftMargin;
        newRightMargin = updatedTile.rightMargin;
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
        //this tile will be added to the right side
        let updatedTile = setTileBoardPosition(
          leftMargin,
          rightMargin,
          newTile,
          "right",
          table
        );
        newTile = updatedTile.tile;
        newLeftMargin = updatedTile.leftMargin;
        newRightMargin = updatedTile.rightMargin;
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
    leftMargin: newLeftMargin,
    rightMargin: newRightMargin,
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
    if (currentTurn !== undefined) {
      if (currentTurn === 0) {
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
  isLeftSideClicked,
  leftMargin,
  rightMargin
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
      table
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
      table
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
  table[0].isValidLeaf = false;
  table[table.length - 1].isValidLeaf = false;

  if (tile.canPlayLeft) {
    table[0].isValidLeaf = true;
  }
  if (tile.canPlayRight) {
    table[table.length - 1].isValidLeaf = true;
  }

  return table;
  // table = removePlaceholderTilesFromBoard(table);
  // if (tile.canPlayLeft) {
  //   let t = new Tile(-1, -2);
  //   table.unshift(t);
  // }

  // if (tile.canPlayRight) {
  //   let t = new Tile(-2, -1);
  //   table.push(t);
  // }

  // return table;
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

export function setTileBoardPosition(
  leftMargin,
  rightMargin,
  tile,
  pos,
  table
) {
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
        if (!leftLimitReached) {
          if (leftMargin < 100) {
            console.log("we need to go up");
            leftLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table
            );
            console.log("after:", newLeftTop);
          } else {
            //we play on the left
            leftMargin = leftMargin - 44;
            tile.leftPos = leftMargin;
          }
        } else {
          if (leftMargin < 100) {
            //is the first tile, so needs to be horizontal no matter what
            tile.topPos = newLeftTop === 121 ? 77 : 98;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 86;
            tile.image = tile.image + "h";
            tile.position = "horizontal";
          } else {
            //we play normal tile in the opposite direction
            tile.topPos = newLeftTop === 121 ? 56 : 77;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 44;
          }
        }
      } else {
        if (!rightLimitReached) {
          if (rightMargin > 950) {
            console.log("we need to go down");
            rightLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table
            );
          } else {
            tile.leftPos = rightMargin;
            rightMargin = rightMargin + 44;
          }
        } else {
          if (rightMargin > 950) {
            //we need to play this horizontally no matter what
            tile.topPos = newRightTop === 379 ? 379 : 358;
            rightMargin = rightMargin - 86;
            tile.leftPos = rightMargin;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0] + "h";
            tile.position = "horizontal";
          } else {
            tile.topPos = newRightTop === 379 ? 357 : 336;
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
        if (!leftLimitReached) {
          if (leftMargin < 100) {
            console.log("we need to go down");
            leftLimitReached = true;
            console.log("before:", newLeftTop);
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table
            );
            console.log("after:", newLeftTop);
          } else {
            //we play on the left
            leftMargin = leftMargin - 86;
            tile.leftPos = leftMargin;
            tile.position = "horizontal";
          }
        } else {
          if (leftMargin < 100) {
            //is the first tile, so needs to be horizontal no matter what
            tile.topPos = newLeftTop === 121 ? 77 : 98;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 86;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          } else {
            //we play normal tile in the opposite direction
            tile.topPos = newLeftTop === 121 ? 77 : 98;
            tile.leftPos = leftMargin;
            leftMargin = leftMargin + 86;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          }
        }
      } else {
        if (!rightLimitReached) {
          if (rightMargin > 950) {
            console.log("we need to go up");
            rightLimitReached = true;
            setTileBoardVerticalPosition(
              leftMargin,
              rightMargin,
              tile,
              pos,
              table
            );
          } else {
            tile.leftPos = rightMargin;
            rightMargin = rightMargin + 86;
            tile.position = "horizontal";
          }
        } else {
          if (rightMargin > 950) {
            //we need to play this horizontally no matter what
            tile.topPos = newRightTop === 379 ? 379 : 358;
            rightMargin = rightMargin - 86;
            tile.leftPos = rightMargin;
            let aux = tile.image.split("");
            tile.image = aux[1] + aux[0];
            tile.position = "horizontal";
          } else {
            tile.topPos = newRightTop === 379 ? 379 : 358;
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
  };
}

export function setTileBoardVerticalPosition(
  leftMargin,
  rightMargin,
  tile,
  pos,
  table
) {
  //we need to know if we are playing in the right or the left of the board (check pos value)
  if (pos === "left") {
    //we play on the left we go up
    if (table[0].leftValue === table[0].rightValue) {
      //tile we are going to attach is a double, values will be different
      tile.topPos = 207 - 86;
      newLeftTop = 207 - 86;
      tile.leftPos = leftMargin;
      tile.image =
        tile.leftValue === tile.rightValue ? tile.image : tile.image + "v";
      tile.position = "vertical";
    } else {
      tile.topPos = 228 - 86;
      newLeftTop = 228 - 86;
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
      newRightTop = tile.topPos + 86;
      rightMargin = rightMargin - 44;
      tile.leftPos = rightMargin;
      tile.image =
        tile.leftValue === tile.rightValue ? tile.image : tile.image + "v";
      tile.position = "vertical";
    } else {
      tile.topPos = 228 + 44;
      newRightTop = tile.topPos + 86;
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
  };
}
