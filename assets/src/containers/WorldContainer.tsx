import * as React from "react";

import SocketContext from "../contexts/SocketContext";
import World from "../components/World";

const WorldContainer: React.FunctionComponent = () => {
  const { worldSub } = React.useContext(SocketContext);
  const [entities, setEntities] = React.useState<any>([]);

  React.useEffect(() => {
    const sub = worldSub.subscribe(entities => {
      setEntities(entities);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [entities]);

  return <World entities={entities} />;
};

export default WorldContainer;
