import "./styles.css";
import Editor from "./Editor";
import { createConnection } from "./connection";

import { useState, useRef } from "react";

function Signin({ onConnection }) {
  const [room, setRoom] = useState("dice-room");
  const [password, setPassword] = useState("");
  return (
    <>
      <input
        type="text"
        value={room}
        placeholder="Room"
        onChange={(event) => setRoom(this.value)}
      />
      <input
        type="text"
        value={password}
        onChange={(event) => setPassword(this.value)}
        placeholder="Password (optional)"
      />
      <button onClick={() => onConnection(createConnection(room, password))}>
        Enter
      </button>
    </>
  );
}

const App = () => {
  const [connectionSet, setConnectionSet] = useState(false);
  const connection = useRef(null);
  const onConnection = (newConnection) => {
    connection.current = newConnection;
    setConnectionSet(true);
  };

  return connectionSet ? (
    <Editor connection={connection.current} />
  ) : (
    <Signin onConnection={onConnection} />
  );
};

export default App;
