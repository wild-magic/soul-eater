import * as React from "react";
import * as ReactDOM from "react-dom";

import WorldContainer from "./containers/WorldContainer";
import SocketContext from "./contexts/SocketContext";
import { worldSub } from "./SocketService";

import "../css/app.css";

const App = () => {
  return (
    <SocketContext.Provider value={{ worldSub: worldSub() }}>
      <div>
        <WorldContainer />
        <h1
          style={{ width: "100%", textAlign: "center", position: "absolute" }}
        >
          Hello World
        </h1>
      </div>
    </SocketContext.Provider>
  );
};

export default (div: HTMLElement) => {
  ReactDOM.render(<App />, div);
};
