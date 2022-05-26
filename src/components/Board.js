function Board(props) {
  return (
    <div
      style={{
        backgroundColor: "#36454F",
        width: "85%",
        height: "75%",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          top: "50%",
          left: "0",
          right: "0",
          position: "fixed",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        {props.table.map(function (table_tile) {
          return table_tile.leftValue !== table_tile.rightValue ? (
            <button
              onClick={
                table_tile.leftValue < 0
                  ? () => props.boardTilePressed(table_tile)
                  : null
              }
              disabled={!table_tile.enabled}
              style={{
                width: "50px",
                height: "30px",
                background: table_tile.isStartingTile ? "#FFC300" : null,
                borderColor: "black",
              }}
              key={table_tile.name}
            >
              {table_tile.leftValue >= 0 ? table_tile.name : "select"}
            </button>
          ) : (
            <button
              onClick={
                table_tile.leftValue < 0
                  ? () => props.boardTilePressed(table_tile)
                  : null
              }
              disabled={!table_tile.enabled}
              style={{
                width: "30px",
                height: "50px",
                background: table_tile.isStartingTile ? "#FFC300" : null,
                borderColor: "black",
              }}
              key={table_tile.name}
            >
              {table_tile.leftValue >= 0 ? table_tile.name : "select"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Board;
