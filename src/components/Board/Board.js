import "../Player/Player.css";
function Board(props) {
  const images = require.context("../../resources", true);
  return (
    <div
      style={{
        backgroundColor: "#36454F",
        width: "85%",
        height: "70%",
        position: "absolute",
        borderRadius: "10px",
        left: "50%",
        top: "48%",
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
          {
            return table_tile.leftValue !== table_tile.rightValue ? (
              table_tile.leftValue < 0 ? (
                <button
                  onClick={
                    table_tile.leftValue < 0
                      ? () => props.boardTilePressed(table_tile)
                      : null
                  }
                  disabled={!table_tile.enabled}
                  style={{
                    width: "55px",
                    height: "35px",
                    borderColor: "black",
                    position: "relative",
                    top: "-17px",
                  }}
                  key={table_tile.name}
                >
                  select
                </button>
              ) : (
                <button
                  style={{
                    borderColor: table_tile.isStartingTile ? "yellow" : "white",
                    background: "transparent",
                    padding: "0",
                    width: "55px",
                    height: "35px",
                    position: "relative",
                    top: "-7px",
                  }}
                  disabled={!table_tile.enabled}
                  key={table_tile.name}
                >
                  <img
                    width={"50px"}
                    height={"30px"}
                    disabled={!table_tile.enabled}
                    src={images(`./${table_tile.image}.png`)}
                  />
                </button>
              )
            ) : table_tile.leftValue < 0 ? (
              <button
                onClick={
                  table_tile.leftValue < 0
                    ? () => props.boardTilePressed(table_tile)
                    : null
                }
                disabled={!table_tile.enabled}
                style={{
                  width: "55px",
                  height: "35px",
                  borderColor: "black",
                  position: "relative",
                  top: "-17px",
                }}
                key={table_tile.name}
              >
                select
              </button>
            ) : (
              <button
                style={{
                  borderColor: "white",
                  background: "transparent",
                  padding: "0",
                  width: "35px",
                  height: "55px",
                }}
                disabled={!table_tile.enabled}
                key={table_tile.name}
              >
                <img
                  width={"30px"}
                  height={"50px"}
                  disabled={!table_tile.enabled}
                  src={images(`./${table_tile.image}.png`)}
                />
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Board;
