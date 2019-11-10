import * as THREE from "three";
export interface Transform {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
}
export default class World {
    scene: THREE.Scene;
    private renderer;
    private camera;
    size: [number, number];
    private worldObjects;
    constructor(canvas: HTMLCanvasElement);
    update(delta?: number): this;
    updateCameraBox(uuid: string): void;
    getWorldObjectByUUID(uuid: string): THREE.Object3D;
    updateEntities(entities: any[]): void;
}
