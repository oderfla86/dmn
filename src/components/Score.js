function Score(props) {
  return (
    <div
      style={{
        backgroundColor: "#36454F",
        textAlign: "center",
        borderRadius: "5px",
        position: "absolute",
        color: "white",
        width: "152px",
        height: "80px",
        position: "absolute",
        left: "87%",
        top: "6%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div>Scoreboard</div>
      <hr />
      <div>TEAM 1 - {props.team1Points}</div>
      <div>TEAM 2 - {props.team2Points}</div>
    </div>
  );
}

export default Score;