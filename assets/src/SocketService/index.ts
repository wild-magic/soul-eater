import { Socket } from "phoenix";
import { Observable } from "rxjs";
import { Entity } from "../components/World";

const socket = new Socket("/socket", { params: { token: null } });
socket.connect();
const lobby = socket.channel("room:lobby", {});

export enum CHANNEL_TYPE {
  JOINED = "joined",
  ERROR = "error",
  WHISPER = "whisper",
  SHOUT = "shout"
}

// TODO: OMG
// TERRIBLE!
export const worldSub = (): Observable<Entity[]> => {
  let state = [];
  lobby
    .join()
    .receive("ok", ({ data }) => {
      const { client_world: clientWorld } = data;
      state = clientWorld;
    })
    .receive(CHANNEL_TYPE.ERROR, resp => {
      console.error(resp);
    });
  return new Observable<any>(subscriber => {
    subscriber.next(state); // by the time subscription happens
    // I think that the OK awk handshake has already passed
    lobby.on(CHANNEL_TYPE.WHISPER, ({ data }) => {
      const { new_world: clientWorld } = data;
      subscriber.next(clientWorld);
    });
    return () => {
      lobby.off();
    };
  });
};

// TODO: put somewhere nice
// const push = () => {
//   lobby
//     .push(
//       "change",
//       { data: { hello: "world" }, type: "hello_world", timestamp: new Date() },
//       10000
//     )
//     .receive("ok", msg => console.log("created message", msg))
//     .receive("error", reasons => console.log("create failed", reasons))
//     .receive("timeout", () => console.log("Networking issue..."));
//   setTimeout(push, 10000);
// };
// push();
