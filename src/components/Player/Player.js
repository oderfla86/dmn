import "./Player.css";

function Player(props) {
  const images = require.context("../../resources", true);
  if (props.isPlayer) {
    return (
      <div className="player1_container">
        <div className="player1">
          {props.hand.map(function (player_tile) {
            return (
              <button
                className=""
                style={{
                  background: player_tile.isSelected
                    ? "#90ee90"
                    : "transparent",
                  border: "transparent",
                  marginRight: "5px",
                }}
                onClick={() => props.playerPlaysTile(player_tile)}
                disabled={!player_tile.enabled}
                key={player_tile.name}
              >
                <img
                  width={"48px"}
                  height={"90px"}
                  disabled={!player_tile.enabled}
                  src={
                    player_tile.leftValue === player_tile.rightValue
                      ? images(`./${player_tile.image}.png`)
                      : images(`./${player_tile.image}v.png`)
                  }
                />
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
            visibility: props.isHand === 0 ? "visible" : "hidden",
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
                {props.isGameOver ? player_tile.name : ""}
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
