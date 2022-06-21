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
        height: "95px",
        marginTop: "-640px",
        marginLeft: "850px",
      }}
    >
      <div>Scoreboard</div>
      <div
        style={{
          fontSize: "7px",
        }}
      >
        v1.0.0
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
