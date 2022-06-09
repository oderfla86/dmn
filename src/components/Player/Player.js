import "./Player.css";

function Player(props) {
  if (props.isPlayer) {
    return (
      <div className="player1_container">
        <div className="player1">
          {props.hand.map(function (player_tile) {
            return (
              <button
                className="player1_tile"
                onClick={() => props.playerPlaysTile(player_tile)}
                style={{
                  background: player_tile.isSelected ? "#90ee90" : null,
                }}
                disabled={!player_tile.enabled}
                key={player_tile.name}
              >
                {player_tile.name}
              </button>
            );
          })}
        </div>
        <div
          className="player1_blocked"
          style={{
            opacity: props.isPlayerBlocked ? "1" : "0",
            visibility: props.isPlayerBlocked ? "visible" : "hidden",
          }}
        >
          Blocked
        </div>
        <span
          className="player1_isHand"
          style={{
            visibility: props.isHand ? "visible" : "hidden",
          }}
        ></span>
      </div>
    );
  } else {
    return (
      <div className={`${props.container}`}>
        <div className={`${props.style}`}>
          {props.hand.map(function (player_tile) {
            return (
              <button
                className={`${props.tileStyle}`}
                disabled={!player_tile.enabled}
                key={player_tile.name}
              >
                {props.isRoundOver ? player_tile.name : ""}
              </button>
            );
          })}
        </div>
        <div className={`${props.blockedClass}`} style={props.blockedStyle}>
          Blocked
        </div>
        <span className={`${props.handClass}`} style={props.isHandStyle}></span>
      </div>
    );
  }
}

export default Player;
