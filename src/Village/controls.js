import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { handleAction } from "./handleAction";

export const createControls = function (scene) {
  scene.cursors = scene.input.keyboard.addKeys({
    space: "space",
    up: "up",
    down: "down",
    left: "left",
    right: "right",
  });

  scene.input.keyboard.on(
    "keydown",
    (event) => {
      if (event.key === "ArrowUp") {
        scene.goingUp = true;
        scene.goingDown = false;
      } else if (event.key === "ArrowDown") {
        scene.goingDown = true;
        scene.goingUp = false;
      } else if (event.key === "ArrowLeft") {
        scene.goingLeft = true;
        scene.goingRight = false;
      } else if (event.key === "ArrowRight") {
        scene.goingRight = true;
        scene.goingLeft = false;
      } else if (event.keyCode === 32) {
        handleAction(scene);
      }
    },
    this
  );

  scene.input.keyboard.on(
    "keyup",
    function (event) {
      if (event.key == "ArrowUp") {
        scene.goingUp = false;
      } else if (event.key == "ArrowDown") {
        scene.goingDown = false;
      } else if (event.key == "ArrowLeft") {
        scene.goingLeft = false;
      } else if (event.key == "ArrowRight") {
        scene.goingRight = false;
      }
    },
    this
  );
};

export const addJoystickForMobile = function (scene) {
  if (!isMobileOrTablet()) {
    return;
  }

  scene.joystick = scene.plugins.get("rexvirtualjoystickplugin").add(scene, {
    x: 100,
    y: 200,
    radius: 100,
    base: scene.add.circle(0, 0, 50, 0xff5544, 0.4).setDepth(10000),
    thumb: scene.add.circle(0, 0, 30, 0xcccccc, 0.3).setDepth(10000),
    dir: "8dir",
    forceMin: 16,
    enable: true,
    inputEnable: true,
    fixed: true,
  });

  // Make floating joystick
  scene.input.on(
    "pointerdown",
    function (pointer) {
      scene.joystick.setPosition(pointer.x, pointer.y);
      scene.joystick.setVisible(true);
      handleAction(scene);
    },
    this
  );

  scene.joystick.on(
    "update",
    function () {
      scene.goingAngle = scene.joystick.angle;

      if (scene.joystick.left) {
        scene.goingLeft = true;
        scene.goingRight = false;

        if (177.5 < scene.goingAngle || -177.5 > scene.goingAngle) {
          scene.goingUp = false;
          scene.goingDown = false;
        }
      } else if (scene.joystick.right) {
        scene.goingRight = true;
        scene.goingLeft = false;

        if (22.5 > scene.goingAngle && -22.5 < scene.goingAngle) {
          scene.goingUp = false;
          scene.goingDown = false;
        }
      }

      if (scene.joystick.up) {
        scene.goingUp = true;
        scene.goingDown = false;

        if (-67.5 > scene.goingAngle && -112.5 < scene.goingAngle) {
          scene.goingRight = false;
          scene.goingLeft = false;
        }
      } else if (scene.joystick.down) {
        scene.goingDown = true;
        scene.goingUp = false;

        if (67.5 < scene.goingAngle && 112.5 > scene.goingAngle) {
          scene.goingRight = false;
          scene.goingLeft = false;
        }
      }
    },
    this
  );

  scene.joystick.on(
    "pointerup",
    function () {
      scene.joystick.setVisible(false);
      scene.stopMoving();
    },
    this
  );
};
