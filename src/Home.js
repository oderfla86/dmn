import { useState } from "react";
import SinglePlayerApp from "./singlePlayer/SinglePlayerApp";

function Home() {
  const [mode, setMode] = useState(null);
  function singlePlayerMode() {
    setMode("single");
  }
  function multiPlayerMode() {
    setMode("multi");
  }

  if (mode === null) {
    return (
      <div
        style={{
          background: "#7393B3",
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          margin: "auto",
          display: "flex",
        }}
      >
        <div
          style={{
            background: "grey",
            width: "200px",
            height: "100px",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            margin: "auto",
            borderRadius: "10px",
            display: "grid",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button onClick={() => singlePlayerMode()}>Single Player</button>
          <button onClick={() => multiPlayerMode()}>Multiplayer</button>
        </div>
      </div>
    );
  } else if (mode === "single") {
    return <SinglePlayerApp />;
  } else {
    //multiplayer
  }
}

export default Home;
