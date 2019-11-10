import * as React from "react";
import * as ReactDOM from "react-dom";

import World from "./components/World";

import "../css/app.css";

const App = () => {
  return (
    <div>
      <h1 style={{ width: "100%", textAlign: "center" }}>Soul Eater</h1>
      <World />
    </div>
  );
};

export default (div: HTMLElement) => {
  ReactDOM.render(<App />, div);
};
