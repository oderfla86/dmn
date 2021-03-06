import "./Player.css";
import "../Tile/Tile";
import Tile from "../Tile/Tile";

function Player(props) {
  const images = require.context("../../../resources", true);
  if (props.isPlayer) {
    return (
      <div
        className="player1_container"
        style={{
          borderColor: props.isMyTurn ? "coral" : null,
          borderStyle: props.isMyTurn ? "solid" : null,
          borderWidth: "3px",
        }}
      >
        <div className="player1">
          {props.hand.map(function (player_tile) {
            return (
              <Tile
                playerTile={player_tile}
                playerPlaysTile={props.playerPlaysTile}
              />
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
    if (props.isGameOver) {
      return (
        <div
          className={`${props.container}`}
          style={{
            borderColor: props.isMyTurn ? "coral" : null,
            borderStyle: props.isMyTurn ? "solid" : null,
            borderWidth: "3px",
          }}
        >
          <div className={`${props.style}`}>
            {props.hand.map(function (player_tile) {
              return (
                <button
                  style={{
                    background: "transparent",
                    border: "transparent",
                    marginRight: "5px",
                  }}
                  disabled={!player_tile.enabled}
                  key={player_tile.name}
                >
                  <img
                    width={"40px"}
                    height={"82px"}
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
          <span
            className={`${props.handClass}`}
            style={props.isHandStyle}
          ></span>
        </div>
      );
    } else {
      return (
        <div
          className={`${props.container}`}
          style={{
            borderColor: props.isMyTurn ? "coral" : null,
            borderStyle: props.isMyTurn ? "solid" : null,
            borderWidth: "3px",
          }}
        >
          <div className={`${props.style}`}>
            {props.hand.map(function (player_tile) {
              return (
                <button
                  className={`${props.tileStyle}`}
                  disabled={!player_tile.enabled}
                  key={player_tile.name}
                ></button>
              );
            })}
          </div>
          <div className={`${props.blockedClass}`} style={props.blockedStyle}>
            Blocked
          </div>
          <span
            className={`${props.handClass}`}
            style={props.isHandStyle}
          ></span>
        </div>
      );
    }
  }
}

export default Player;
