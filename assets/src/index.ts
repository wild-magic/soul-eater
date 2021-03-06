import { Socket } from "phoenix";
import startApp from "./App";
import "../css/app.css";

let socket = new Socket("/socket", { params: { token: null } });

socket.connect();
let channel = socket.channel("room:lobby", {});
//let initialState = null
channel
  .join()
  .receive("ok", resp => {
//    initialState = resp
    console.log("Joined successfully, initial state: ", resp);
  })
  .receive("error", resp => {
    console.log("Unable to join", resp);
  });
channel.on("whisper", msg => console.log("Got whisper", msg));
channel.on("shout", msg => console.log("Got shout", msg));
const push = () => {
  channel.push("change", {data: {hello: "world"}, type: "hello_world", timestamp: new Date()}, 10000)
    .receive("ok", (msg) => console.log("created message", msg) )
    .receive("error", (reasons) => console.log("create failed", reasons) )
    .receive("timeout", () => console.log("Networking issue...") )
  setTimeout(push, 10000)
}
push()

// const events = {
//   // GET FRESH STATE // CLIENT send USER NAME // SERVER gets init state
//   ON_INIT: "ON_INIT",

/*
const events = {
  // GET FRESH STATE // CLIENT send USER NAME // SERVER gets init state
  ON_INIT: "ON_INIT",

//   // every 60000 / 120 ms or NOT ?
//   RECEIVE_STATE_CHANGE: "RECEIVE_STATE_CHANGE"
// };

  // every 60000 / 120 ms or NOT ?
  RECEIVE_STATE_CHANGE: "RECEIVE_STATE_CHANGE"
};
*/

import startApp from "./App";
import "../css/app.css";
startApp(document.getElementById("app"));
