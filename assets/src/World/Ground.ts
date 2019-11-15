import * as THREE from "three";
import { Object3D } from "three";

export default class Ground extends Object3D {
  constructor({ position, scale, rotation }) {
    super();

    const groundGeo = new THREE.PlaneGeometry(scale, scale, 10);
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0x65c34a,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    const rot = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
    this.add(ground);
    this.quaternion.setFromAxisAngle(rot, Math.PI / 2);
    ground.receiveShadow = true;
    this.position.set(position.x, position.y, position.z);
  }
}
