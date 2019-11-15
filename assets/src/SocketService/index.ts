import { Socket } from "phoenix";
import { Observable } from "rxjs";
import { Entity } from "../components/World";

const socket = new Socket("/socket", { params: { token: null } });
socket.connect();
const lobby = socket.channel("room:lobby", {});

export enum CHANNEL_TYPE {
  JOINED = "ok",
  ERROR = "error",
  WHISPER = "whisper",
  SHOUT = "shout"
}

export const worldSub = (): Observable<Entity[]> => {
  return new Observable<any>(subscriber => {
    if (!lobby.joinedOnce) {
      lobby
        .join()
        .receive(CHANNEL_TYPE.JOINED, ({ data }) => {
          const { client_world: clientWorld } = data;
          subscriber.next(clientWorld);
        })
        .receive(CHANNEL_TYPE.ERROR, resp => {
          // TODO: something on error?
          console.error(resp);
        });
    }
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
