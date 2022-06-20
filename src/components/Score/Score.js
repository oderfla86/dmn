function Score(props) {
  return (
    <div
      style={{
        backgroundColor: "#36454F",
        textAlign: "center",
        borderRadius: "5px",
        position: "absolute",
        color: "white",
        width: "145px",
        height: "80px",
        right: "165px",
        marginTop: "5px",
      }}
    >
      <div>Scoreboard</div>
      <div
        style={{
          fontSize: "7px",
          right: "5%",
          top: "10%",
          position: "absolute",
        }}
      >
        v1.0.0
      </div>
      <hr />
      <div>TEAM 1 - {props.team1Points}</div>
      <div>TEAM 2 - {props.team2Points}</div>
    </div>
  );
}

export default Score;
