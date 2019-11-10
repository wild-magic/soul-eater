export const Sphere = {
  id: "blah",
  type: "sphere",
  color: "blue",
  radius: 1.3,
  physics: {
    mass: 5
  },
  scale: 0.5,
  position: {
    x: 0,
    y: 15,
    z: 0
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0
  }
};

export const Ground = {
  id: "blah2",
  type: "ground",
  physics: {
    mass: 0
  },
  scale: 100,
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  rotation: {
    x: 1,
    y: 0,
    z: 0
  }
};
