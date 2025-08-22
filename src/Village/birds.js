import "../Sprites/Bird";
import { playSound, preloadSound } from "../Utils/music";

export const addBirds = function (scene) {
  createBirdAnims(scene);
  preloadSound("sfx_oiseaux_volent", scene);

  scene.map.getObjectLayer("birds").objects.forEach((birdPosition) => {
    scene.birds.push(
      scene.add.bird(birdPosition.x, birdPosition.y).setDepth(160)
    );
  });

  scene.physics.add.collider(scene.birds, scene.hero, (bird) => {
    playSound(
      "sfx_oiseaux_volent",
      scene,
      true,
      Phaser.Math.Between(4, 8) / 10
    );
    bird.fly();
  });
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
  scene.birds.forEach((bird) => bird.destroy());
  scene.birds = [];
};

export const createBirdAnims = function (scene) {
  const anims = scene.anims;

  anims
    .create({
      key: "bird-idle-anim-1",
      frames: anims.generateFrameNames("sprites", {
        start: 1,
        end: 4,
        prefix: "bird-idle-",
      }),
      repeat: -1,
      frameRate: 1,
    })
    .addFrame(
      anims.generateFrameNames("sprites", {
        start: 3,
        end: 2,
        prefix: "bird-idle-",
      })
    );

  anims.create({
    key: "bird-idle-anim-2",
    frames: [
      {
        key: "sprites",
        frame: "bird-idle-2",
      },
      {
        key: "sprites",
        frame: "bird-idle-3",
      },
      {
        key: "sprites",
        frame: "bird-idle-4",
      },
      {
        key: "sprites",
        frame: "bird-idle-3",
      },
      {
        key: "sprites",
        frame: "bird-idle-2",
      },
    ],
    repeat: -1,
    frameRate: 2,
  });

  anims.create({
    key: "bird-idle-anim-3",
    frames: [
      {
        key: "sprites",
        frame: "bird-idle-3",
      },
      {
        key: "sprites",
        frame: "bird-idle-4",
      },
      {
        key: "sprites",
        frame: "bird-idle-3",
      },
      {
        key: "sprites",
        frame: "bird-idle-2",
      },
      {
        key: "sprites",
        frame: "bird-idle-1",
      },
    ],
    repeat: -1,
    frameRate: 3,
  });

  anims.create({
    key: "bird-flying",
    frames: anims.generateFrameNames("sprites", {
      start: 1,
      end: 3,
      prefix: "bird-flying-",
    }),
    repeat: -1,
    frameRate: 10,
  });
};
