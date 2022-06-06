import { useState, useEffect, useRef } from "react";
import {
  getTotalOfValidPlayers,
  createGame,
  randomisePlayersTurnOrder,
  getStsartingPlayer,
} from "../../Util";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";

function Dashboard(props) {
  const [name, setName] = useState("");
  const [disable, setDisable] = useState(false);
  const [arePlayersReady, setArePlayersReady] = useState(false);
  const [listOfPlayers, setListOfPlayers] = useState([]);

  let app;
  let db = useRef(null);
  let isAdmin = useRef(false);
  let gameRef = useRef(null);
  let playerId = useRef(null);
  let playerRef = useRef(null);
  let allPlayersRef;
  let allPlayersList = useRef([]);

  const firebaseConfig = {
    apiKey: "AIzaSyA_T3E_8xIgUSf8VUxkEkcMY0S-InUp2Yo",
    authDomain: "dmn-multiplayer.firebaseapp.com",
    databaseURL: "https://dmn-multiplayer-default-rtdb.firebaseio.com",
    projectId: "dmn-multiplayer",
    storageBucket: "dmn-multiplayer.appspot.com",
    messagingSenderId: "209039171258",
    appId: "1:209039171258:web:06b6d6acc30a8a8a936c83",
  };

  useEffect(() => {
    app = initializeApp(firebaseConfig);
    db.current = getDatabase(app);
    gameRef.current = ref(db.current, `game`);
    setInitialState();
  }, []);

  async function setInitialState() {
    allPlayersRef = ref(db.current, `players`);

    let result = await signInAnonymously(getAuth(app));
    if (result) {
      console.log("Logged in as:", result.user.uid);
      playerId.current = result.user.uid;
      playerRef.current = ref(db.current, `players/${playerId.current}`);
      set(playerRef.current, {
        name: "dummy",
        id: playerId.current,
      });

      onDisconnect(playerRef.current).remove();

      onValue(allPlayersRef, (snapshot) => {
        //fires whenever a change occurs
        let allPlayers = snapshot.val();
        let arrayOfPlayers = getTotalOfValidPlayers(allPlayers); //players with valid username
        allPlayersList.current = arrayOfPlayers;
        setListOfPlayers(arrayOfPlayers);
        if (Object.keys(allPlayers).length === 1) {
          set(gameRef.current, {
            admin: playerId.current,
          });
        }
        if (arrayOfPlayers.length < 2) {
          setArePlayersReady(false);
          console.log(
            "Waiting for more player to join " + arrayOfPlayers.length + "/4"
          );
        } else {
          //we are ready to start the game
          setArePlayersReady(isAdmin.current);
        }
      });

      onValue(gameRef.current, (snapshot) => {
        //fires whenever a change occurs in game object
        let boardState = snapshot.val();
        if (boardState) {
          if (boardState.admin === playerId.current) {
            isAdmin.current = true;
          } else {
            isAdmin.current = false;
          }
          if (boardState.shouldStartGame) {
            props.gameReady(playerId.current);
          }
        }
      });
    } else {
      console.log("Couldn't log in");
    }
  }

  function initialisingGameData() {
    //get random order of players
    let newState = createGame(); // contains hands and table values. We need to assign them to each player now, randomly.
    let orderOfPlayers = randomisePlayersTurnOrder(listOfPlayers, newState); //returns a list of objects with username and firebase id + hand
    let startingPlayer = playerId.current;
    // let startingPlayer = getStsartingPlayer(orderOfPlayers); //returns the id of the user who has 6:6 in their hand

    update(gameRef.current, {
      team1Points: 0,
      team2Points: 0,
      rounds: 0,
      shouldStartGame: true,
      isGameRunning: false,
      startingPlayer: startingPlayer,
      order: JSON.stringify(orderOfPlayers),
    });
  }

  function submitUser(e) {
    e.preventDefault();
    console.log("User submitted:", name);
    setDisable(true);
    update(playerRef.current, {
      name,
    });
  }

  function startGame(e) {
    e.preventDefault();
    console.log("Game is ready to start");
    console.log("Initialising relevant game data");
    initialisingGameData();
    // newState.rounds = round + 1;
    // newState.team1Points = team1Points;
    // newState.team2Points = team2Points;
    // newState.startingPlayer = currentPlayer + 1 < 4 ? currentPlayer + 1 : 0;
    // setInitialSate(newState);
    // setIsLoading(true);
  }

  return (
    <div
      style={{
        backgroundColor: "#7393B3",
        position: "absolute",
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <form style={{ margin: "auto" }}>
        <label>
          Username:
          <input
            disabled={disable}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
        <button
          disabled={disable}
          onClick={(e) => {
            submitUser(e);
          }}
        >
          Submit
        </button>
        <button
          disabled={!arePlayersReady}
          onClick={(e) => {
            startGame(e);
          }}
        >
          Start game
        </button>
        <label>{"Total number of players:" + listOfPlayers.length}</label>
      </form>
      {listOfPlayers.length > 0 ? (
        <ul style={{ margin: "auto" }}>
          {listOfPlayers.map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default Dashboard;
