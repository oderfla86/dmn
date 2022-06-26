function Tile(props) {
  const images = require.context("../../resources", true);
  return (
    <button
      style={{
        borderColor: props.playerTile.isSelected
          ? "#90ee90"
          : props.playerTile.isStartingTile
          ? "#FFA200"
          : "black",
        background: "transparent",
        padding: "0",
        width: "52px",
        height: "94px",
        marginRight: "15px",
      }}
      onClick={() => props.playerPlaysTile(props.playerTile)}
      disabled={!props.playerTile.enabled}
      key={props.playerTile.name}
    >
      <img
        width={"48px"}
        height={"90px"}
        disabled={!props.playerTile.enabled}
        src={
          props.playerTile.leftValue === props.playerTile.rightValue
            ? images(`./${props.playerTile.image}.png`)
            : images(`./${props.playerTile.image}v.png`)
        }
      />
    </button>
  );
}

export default Tile;
