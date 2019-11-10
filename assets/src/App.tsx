import * as React from "react";
import * as ReactDOM from "react-dom";

import World from "./components/World";

import "../css/app.css";

const App = () => {
  return (
    <div>
      <World />
      <h1 style={{ width: "100%", textAlign: "center", position: "absolute" }}>
        Soul Eater baba
      </h1>
    </div>
  );
};

export default (div: HTMLElement) => {
  ReactDOM.render(<App />, div);
};
