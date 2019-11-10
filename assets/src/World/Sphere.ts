import * as THREE from "three";
import { Object3D } from "three";

export default class Sphere extends Object3D {
  constructor({ position, scale, rotation }) {
    super();

    const groundGeo = new THREE.SphereGeometry(scale, 14, 14);
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0xff6666
    });
    const sphereMesh = new THREE.Mesh(groundGeo, groundMat);
    const rot = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
    this.add(sphereMesh);
    this.quaternion.setFromAxisAngle(rot, Math.PI / 2);
    sphereMesh.receiveShadow = true;
    this.position.set(position.x, position.y, position.z);

    const axesHelper = new THREE.AxesHelper(scale * 2);
    this.add(axesHelper);
  }
}
