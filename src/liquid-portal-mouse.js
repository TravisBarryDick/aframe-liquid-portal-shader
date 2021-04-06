AFRAME.registerComponent("liquid-portal-mouse", {
  schema: {
    moveFrac: { type: "number", default: 0.1 },
  },

  init: function () {
    this.mouseCoords = { x: 0, y: 0 };
    this.mouseMoveHandler = (evt) => {
      this.mouseCoords.x = (evt.clientX / window.innerWidth) * 2 - 1;
      this.mouseCoords.y = (evt.clientY / window.innerHeight) * 2 - 1;
    };
    this.raycaster = new THREE.Raycaster();
    this.targetCenter = new THREE.Vector2(0.5, 0.5);
    this.currentCenter = new THREE.Vector2(0.5, 0.5);
  },

  play: function () {
    window.addEventListener("mousemove", this.mouseMoveHandler, false);
  },

  pause: function () {
    window.removeEventListener("mousemove", this.mouseMoveHandler, false);
  },

  tick: function (time) {
    this.raycaster.setFromCamera(this.mouseCoords, this.el.sceneEl.camera);
    let intersections = this.raycaster.intersectObject(
      this.el.getObject3D("mesh")
    );
    if (intersections.length > 0) {
      let mouseUV = intersections[0].uv;
      this.targetCenter.set(mouseUV.x, 1.0 - mouseUV.y);
    }

    this.currentCenter.lerp(this.targetCenter, this.data.moveFrac);

    this.el.setAttribute("material", {
      rippleCenter: this.currentCenter,
      timeMsec: time,
    });
  },
});
