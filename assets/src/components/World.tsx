import * as React from "react";
import useRaf from "@rooks/use-raf";

import World from "../World/";

import "./world-component.css";

export type Entity = {
  id: string;
  type: string[];
  [key: string]: any;
};

const WorldComponent: React.FunctionComponent<{ entities?: Entity[] }> = ({
  entities
}) => {
  const shouldRender = true;
  const canvasRef = React.useRef();
  const worldRef = React.useRef<World>();

  React.useEffect(() => {
    if (worldRef.current) {
      worldRef.current.updateEntities(entities);
    }
  }, [worldRef.current, entities]);

  React.useEffect(() => {
    if (canvasRef.current) {
      worldRef.current = new World(canvasRef.current);
    }
  }, [canvasRef && canvasRef.current]);

  useRaf(() => {
    worldRef && worldRef.current && worldRef.current.update();
  }, shouldRender);
  return <canvas className="world-component" ref={canvasRef} />;
};

export default WorldComponent;
