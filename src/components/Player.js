function Player(props) {
  if (props.isPlayer) {
    return (
      <div>
        <div style={props.style}>
          {props.hand.map(function (player_tile) {
            return (
              <button
                onClick={() => props.playerPlaysTile(player_tile)}
                disabled={!player_tile.enabled}
                style={{
                  width: "40px",
                  height: "60px",
                  marginRight: "5px",
                  borderColor: "black",
                  background: player_tile.isSelected ? "#90ee90" : null,
                }}
                key={player_tile.name}
              >
                {player_tile.name}
              </button>
            );
          })}
        </div>
        <div
          style={{
            backgroundColor: "#36454F",
            textAlign: "center",
            borderRadius: "5px",
            color: "white",
            width: "70px",
            height: "30px",
            position: "absolute",
            left: "65%",
            top: "93%",
            transform: "translate(-50%, -50%)",
            opacity: props.isPlayerBlocked ? "1" : "0",
            transition: "all 1s",
            visibility: props.isPlayerBlocked ? "visible" : "hidden",
          }}
        >
          Blocked
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div style={props.style}>
          {props.hand.map(function (player_tile) {
            return (
              <button
                disabled={!player_tile.enabled}
                style={props.tileStyle}
                key={player_tile.name}
              >
                {props.isGameOver ? player_tile.name : ""}
              </button>
            );
          })}
        </div>
        <div style={props.blockedStyle}>Blocked</div>
      </div>
    );
  }
}

export default Player;
