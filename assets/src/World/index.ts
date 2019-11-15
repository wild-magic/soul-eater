import * as THREE from "three";
import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";
import Sphere from "./Sphere";
import Ground from "./Ground";
import { Vector3 } from "three";

export interface Transform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

// A simple world renderer.
export default class World {
  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public size: [number, number];
  private worldObjects: {
    [uuid: string]: THREE.Object3D;
  };
  constructor(canvas: HTMLCanvasElement) {
    this.worldObjects = {};
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.shadowMap.enabled = true;
    this.size = [canvas.clientWidth, canvas.clientHeight];
    this.renderer.setSize(...this.size);

    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.01,
      1000
    );

    this.camera.name = "debug-camera";
    this.camera.position.set(
      -163.142841187104,
      164.0910487831358,
      146.01013589903187
    );
    this.camera.rotation.set(
      -0.7262987712106262,
      -0.3717559030073651,
      -0.31212058809157306
    );

    //-163.142841187104, 164.0910487831358, 146.01013589903187
    //-0.8436387180748958, _y: -0.6388448962987707, _z: -0.5903801946609168
    this.scene.add(this.camera);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;

    const starsGeometry = new THREE.Geometry();

    for (let i = 0; i < 5000; i++) {
      const star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(2000);
      star.y = THREE.Math.randFloatSpread(2000);
      star.z = THREE.Math.randFloatSpread(2000);

      starsGeometry.vertices.push(star);
    }

    const starsMaterial = new THREE.PointsMaterial({ color: 0xfee2f8 });

    const starsGeometry2 = new THREE.Geometry();
    for (let i = 0; i < 5000; i++) {
      const star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(2000);
      star.y = THREE.Math.randFloatSpread(2000);
      star.z = THREE.Math.randFloatSpread(2000);

      starsGeometry2.vertices.push(star);
    }

    const starsMaterial2 = new THREE.PointsMaterial({ color: 0x00bcd4 });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    const starField2 = new THREE.Points(starsGeometry2, starsMaterial2);
    this.scene.add(starField);
    this.scene.add(starField2);
    this.worldObjects["startField"] = starField;
    this.worldObjects["startField2"] = starField2;

    // LIGHTS
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
    //
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    this.scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    window.addEventListener(
      "resize",
      () => {
        this.size = [window.innerWidth, window.innerHeight];
        // TODO maybe cycle through all cameras
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );
  }

  update(delta?: number) {
    this.renderer.render(this.scene, this.camera);
    this.worldObjects.startField.rotation.x += 0.001;
    this.worldObjects.startField.rotation.y += 0.001;
    this.worldObjects.startField2.rotation.x -= 0.001;
    this.worldObjects.startField2.rotation.y -= 0.001;
    return this;
  }

  updateCameraBox(uuid: string) {}

  getWorldObjectByUUID(uuid: string) {
    return this.worldObjects[uuid] || null;
  }

  updateEntities(entities: any[]) {
    entities.forEach(entity => {
      const worldObject = this.worldObjects[entity.id];
      if (worldObject) {
        if (!entity.position.x) {
          return;
        }
        const newVector = new Vector3(
          entity.position.x,
          entity.position.y,
          entity.position.z
        );
        worldObject.position.copy(newVector);
        worldObject.rotation.set(
          entity.rotation.x,
          entity.rotation.y,
          entity.rotation.z
        );
        worldObject.children.forEach(child => {
          // @ts-ignore
          const color = (child as THREE.Mesh).material.color.getHex();
          // @ts-ignore
          (child as THREE.Mesh).material.color.setHex(color + 10);
        });
        worldObject.matrixWorldNeedsUpdate = true;
      } else {
        let object;
        if (entity.type === "sphere") {
          object = new Sphere(entity);
        }
        if (entity.type === "ground") {
          object = new Ground(entity);
        }
        object.name = entity.id;
        this.worldObjects[entity.id] = object;
        this.scene.add(this.worldObjects[entity.id]);
      }
    });
  }
}
