import * as React from "react";
import * as ReactDOM from "react-dom";

const App = () => {
  return <h1>🌈Hello Friends I am so cool🌈</h1>;
};

export default (div: HTMLElement) => {
  ReactDOM.render(<App />, div);
};
