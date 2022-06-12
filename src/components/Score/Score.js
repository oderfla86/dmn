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
        left: "87%",
        top: "6%",
        transform: "translate(-50%, -50%)",
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
        v1.0.1
      </div>
      <hr />
      <div>
        {props.team1Name} - {props.team1Points}
      </div>
      <div>
        {props.team2Name} - {props.team2Points}
      </div>
    </div>
  );
}

export default Score;
