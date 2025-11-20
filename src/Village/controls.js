import Game from "../Game";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { handleAction } from "./handleAction";

/** @param {Game} scene  */
export const createControls = function (scene) {
  scene.cursors = scene.input.keyboard.addKeys({
    space: "space",
    up: "up",
    down: "down",
    left: "left",
    right: "right",
    w: "up",
    z: "up",
    q: "left",
    a: "left",
    s: "down",
    d: "right",
  });

  scene.input.keyboard.on(
    "keydown",
    (event) => {
      if (scene.isCinematic) return;

      if (["ArrowUp", "z", "w"].includes(event.key)) {
        scene.goingUp = true;
        scene.goingDown = false;
        scene.howToPlay = false;
      } else if (["ArrowDown", "s"].includes(event.key)) {
        scene.goingDown = true;
        scene.goingUp = false;
        scene.howToPlay = false;
      } else if (["ArrowLeft", "q", "a"].includes(event.key)) {
        scene.goingLeft = true;
        scene.goingRight = false;
        scene.howToPlay = false;
      } else if (["ArrowRight", "d"].includes(event.key)) {
        scene.goingRight = true;
        scene.goingLeft = false;
        scene.howToPlay = false;
      } else if (event.keyCode === 32) {
        handleAction(scene);
      }
    },
    this
  );

  scene.input.keyboard.on(
    "keyup",
    (event) => {
      if (scene.isCinematic) return;

      if (["ArrowUp", "z", "w"].includes(event.key)) {
        scene.goingUp = false;
      } else if (["ArrowDown", "s"].includes(event.key)) {
        scene.goingDown = false;
      } else if (["ArrowLeft", "q", "a"].includes(event.key)) {
        scene.goingLeft = false;
      } else if (["ArrowRight", "d"].includes(event.key)) {
        scene.goingRight = false;
      }
    },
    this
  );
};

export const addJoystickForMobile = function (scene) {
  if (!isMobileOrTablet()) return;

  scene.joystick = scene.plugins.get("rexvirtualjoystickplugin").add(scene, {
    x: 100,
    y: 200,
    radius: 50,
    base: scene.add.circle(0, 0, 40, 0xff5544, 0.2).setDepth(10000),
    thumb: scene.add.circle(0, 0, 20, 0xffffff, 0.3).setDepth(10000),
    dir: "8dir",
    forceMin: 16,
    enable: true,
    inputEnable: true,
    fixed: true,
  });

  // Make floating joystick
  scene.input.on(
    "pointerdown",
    (pointer) => {
      if (scene.isCinematic) return;

      scene.joystick.setPosition(pointer.x, pointer.y);
      scene.joystick.setVisible(true);
      handleAction(scene);
    },
    this
  );

  scene.joystick.on(
    "update",
    () => {
      if (scene.isCinematic) return;

      scene.howToPlay = false;
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
    () => {
      if (scene.isCinematic) return;

      scene.joystick.setVisible(false);
      scene.stopMoving();
    },
    this
  );
};
