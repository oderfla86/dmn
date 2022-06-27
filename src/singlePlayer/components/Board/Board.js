function Board(props) {
  const images = require.context("../../../resources", true);
  return (
    <div
      style={{
        backgroundColor: "#36454F",
        width: "1100px",
        height: "500px",
        borderRadius: "10px",
        position: "absolute",
      }}
    >
      {props.table.map(function (table_tile) {
        {
          return table_tile.position === "vertical" ? (
            <button
              onClick={
                table_tile.isValidLeaf
                  ? () => props.boardTilePressed(table_tile)
                  : null
              }
              style={{
                borderColor: table_tile.isValidLeaf
                  ? "#90ee90"
                  : table_tile.isStartingTile
                  ? "#FFA200"
                  : "black",
                background: "transparent",
                padding: "0",
                top: `${table_tile.topPos}px`,
                left: `${table_tile.leftPos}px`,
                width: "44px",
                height: "86px",
                position: "absolute",
              }}
              disabled={!table_tile.enabled}
              key={table_tile.name}
            >
              <img
                width={"40px"}
                height={"82px"}
                alt="Board Tile"
                disabled={!table_tile.enabled}
                src={images(`./${table_tile.image}.png`)}
              />
            </button>
          ) : (
            <button
              onClick={
                table_tile.isValidLeaf
                  ? () => props.boardTilePressed(table_tile)
                  : null
              }
              style={{
                borderColor: table_tile.isValidLeaf
                  ? "#90ee90"
                  : table_tile.isStartingTile
                  ? "#FFA200"
                  : "black",
                background: "transparent",
                position: "absolute",
                padding: "0",
                top: `${table_tile.topPos}px`,
                left: `${table_tile.leftPos}px`,
                width: "86px",
                height: "44px",
              }}
              disabled={!table_tile.enabled}
              key={table_tile.name}
            >
              <img
                width={"82px"}
                height={"40px"}
                alt="Board Tile"
                disabled={!table_tile.enabled}
                src={images(`./${table_tile.image}.png`)}
              />
            </button>
          );
        }
      })}
    </div>
  );
}

export default Board;
