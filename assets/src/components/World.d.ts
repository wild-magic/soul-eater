import * as React from "react";
import "./world-component.css";
export declare type Entity = {
    id: string;
    type: string[];
    [key: string]: any;
};
declare const WorldComponent: React.FunctionComponent<{
    entities?: Entity[];
}>;
export default WorldComponent;
