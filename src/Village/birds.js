import "../Sprites/Bird";
import { COLORS } from "../Sprites/Bird";
import { preloadSound } from "../Utils/music";

export const addBirds = function (scene) {
  createBirdAnims(scene);
  preloadSound("sfx_oiseaux_volent", scene);

  scene.map.getObjectLayer("birds").objects.forEach((birdPosition) => {
    scene.birds.push(
      scene.add.bird(birdPosition.x, birdPosition.y).setDepth(160)
    );
  });

  scene.physics.add.collider(scene.birds, scene.hero, (bird) => bird.fly());
};

export const lessBirds = function (scene) {
  scene.birds.forEach((bird, index) => {
    if (Phaser.Math.Between(0, 1)) {
      scene.birds.splice(index, 1);
      bird.destroy();
    }
  });
};

export const noMoreBirds = function (scene) {
  scene.isNoMoreBirds = true;
  scene.birds.forEach((bird) => bird.hide());
};

export const showBirds = function (scene) {
  scene.isNoMoreBirds = false;
  scene.birds.forEach((bird) => bird.show());
};

export const createBirdAnims = function (scene) {
  const anims = scene.anims;

  COLORS.forEach((color) => {
    anims
      .create({
        key: `bird-${color}-idle-anim-1`,
        frames: anims.generateFrameNames("sprites", {
          start: 1,
          end: 4,
          prefix: `bird-${color}-idle-`,
        }),
        repeat: -1,
        frameRate: 1,
      })
      .addFrame(
        anims.generateFrameNames("sprites", {
          start: 3,
          end: 2,
          prefix: `bird-${color}-idle-`,
        })
      );

    anims.create({
      key: `bird-${color}-idle-anim-2`,
      frames: [
        {
          key: "sprites",
          frame: `bird-${color}-idle-2`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-3`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-4`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-3`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-2`,
        },
      ],
      repeat: -1,
      frameRate: 2,
    });

    anims.create({
      key: `bird-${color}-idle-anim-3`,
      frames: [
        {
          key: "sprites",
          frame: `bird-${color}-idle-3`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-4`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-3`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-2`,
        },
        {
          key: "sprites",
          frame: `bird-${color}-idle-1`,
        },
      ],
      repeat: -1,
      frameRate: 3,
    });

    anims.create({
      key: `bird-${color}-flying`,
      frames: anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: `bird-${color}-flying-`,
      }),
      repeat: -1,
      frameRate: 10,
    });
  });
};
