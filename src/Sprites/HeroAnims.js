const moveframerate = 10;
const idleframerate = 4;

export const createHeroAnims = function (anims) {
  anims.create({
    key: "mai-walk-down",
    frames: anims.generateFrameNames("mai", {
      start: 1,
      end: 4,
      prefix: "walk-down-",
    }),
    repeat: -1,
    yoyo: true,
    frameRate: moveframerate,
  });

  anims.create({
    key: "mai-walk-up",
    frames: anims.generateFrameNames("mai", {
      start: 1,
      end: 4,
      prefix: "walk-up-",
    }),
    repeat: -1,
    yoyo: true,
    frameRate: moveframerate,
  });

  anims
    .create({
      key: "mai-walk-side",
      frames: anims.generateFrameNames("mai", {
        start: 1,
        end: 4,
        prefix: "walk-right-",
      }),
      repeat: -1,
      //yoyo: true,
      frameRate: moveframerate,
    })
    .addFrame(
      anims.generateFrameNames("mai", {
        start: 2,
        end: 3,
        prefix: "walk-right-",
      })
    );

  anims.create({
    key: "mai-idle-down",
    frames: [
      {
        key: "mai",
        frame: "idle-down-1",
        duration: 1500,
      },
      {
        key: "mai",
        frame: "idle-down-2",
        duration: 200,
      },
    ],
    repeat: -1,
  });

  anims.create({
    key: "mai-idle-up",
    frames: [
      {
        key: "mai",
        frame: "idle-up",
      },
    ],
    repeat: -1,
    frameRate: idleframerate,
  });

  anims.create({
    key: "mai-idle-side",
    frames: [
      {
        key: "mai",
        frame: "idle-right-1",
        duration: 1500,
      },
      {
        key: "mai",
        frame: "idle-right-2",
        duration: 200,
      },
    ],
    repeat: -1,
    yoyo: true,
    frameRate: idleframerate,
  });
};
