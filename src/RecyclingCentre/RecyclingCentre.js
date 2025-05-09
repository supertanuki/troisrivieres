import isMobileOrTablet from "../Utils/isMobileOrTablet";
import MiniGameUi from "../UI/MiniGameUi";
import {
  gameDuration,
  urlParamHas,
} from "../Utils/debug";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { FONT_RESOLUTION } from "../UI/Message";
import { playMiniGameTheme } from "../Utils/music";

const OBJECTSPECS = {
  console1: { w: 4, h: 2 },
  //console2: { w: 4, h: 2 },
  //console3: { w: 4, h: 2 },
  //console4: { w: 4, h: 2 },
  laptop: { w: 4, h: 3 },
  phone: { w: 1, h: 2 },
  screen: { w: 3, h: 3 },
};

const MATRIX_SIZE = { w: 20, h: 29 };
const STEP = 10;
const STEPTIME = 400;
const DECREMENTSTEPTIME = 20;
const MATRIX_DELTA_X = 200;

const uniqueObjects = (objects) => {
  const seen = new Set();
  return objects.filter((element) => {
    const duplicate = seen.has(element.id);
    seen.add(element.id);
    return !duplicate;
  });
};

export default class RecyclingCentre extends MiniGameUi {
  constructor() {
    super({
      key: "recyclingCentre",
    });

    this.delayBetweenObjects = 500;
    this.objects = [];
    this.currentObject = null;
    this.currentObjectId = 0;
    this.lastTime = 0;

    this.matrix = [];
    this.matrixPosition = 0;
    this.container = [];
    this.stepTime = STEPTIME;

    this.lastObjectWasDropped = false;
    this.objectsGroupValidated = 0;
  }

  preload() {
    super.preload();

    this.load.atlas("factory", "sprites/factory.png", "sprites/factory.json");
    this.load.atlas(
      "recycling",
      "sprites/recycling.png",
      "sprites/recycling.json"
    );
  }

  create() {
    this.timeStart = Date.now();
    super.create();
    this.cameras.main.setBackgroundColor(0x777777);
    this.scale.setGameSize(550, 300);

    const y = MATRIX_SIZE.h * STEP - 1;
    this.container.push(
      this.add.line(MATRIX_DELTA_X, 0, 0, y, 200, y, 0x000000).setOrigin(0, 0)
    );

    this.container.push(
      this.add
        .line(MATRIX_DELTA_X, 0, 0, y - 20, 0, y, 0x000000)
        .setOrigin(0, 0)
    );

    this.container.push(
      this.add
        .line(MATRIX_DELTA_X, 0, 200, y - 20, 200, y, 0x000000)
        .setOrigin(0, 0)
    );

    this.container.push(
      this.add
        .circle(MATRIX_DELTA_X + 20, y - 10, 10, 0x000000)
        .setOrigin(0, 0)
    );
    this.container.push(
      this.add
        .circle((MATRIX_DELTA_X + (MATRIX_SIZE.w -1) * STEP) - 30, y - 10, 10, 0x000000)
        .setOrigin(0, 0)
    );

    // init default objects
    this.initObject("console1", 1, MATRIX_SIZE.h - OBJECTSPECS["console1"].h);
    this.setCurrentObjectPositionInMatrix();
    this.initObject("console1", 2, MATRIX_SIZE.h - 2 * OBJECTSPECS["console1"].h);
    this.setCurrentObjectPositionInMatrix();
    this.initObject("laptop", 7, MATRIX_SIZE.h - OBJECTSPECS["laptop"].h);
    this.setCurrentObjectPositionInMatrix();
    this.initObject("phone", 12, MATRIX_SIZE.h - OBJECTSPECS["phone"].h);
    this.setCurrentObjectPositionInMatrix();
    this.initObject("screen", 14, MATRIX_SIZE.h - OBJECTSPECS["screen"].h);
    this.setCurrentObjectPositionInMatrix();
    this.initObject("screen", 15, MATRIX_SIZE.h - 2 * OBJECTSPECS["screen"].h);
    this.setCurrentObjectPositionInMatrix();
    this.currentObject = null; // important

    this.createControls();
    this.startGame();
  }

  startGame() {
    if (urlParamHas("recyclingCentre")) {
      playMiniGameTheme(this);
    }

    this.cameras.main.fadeIn(2000, 0, 0, 0);

    /*
    this.time.addEvent({
      callback: () => this.startDiscussion("factory"),
      delay: 1000,
    });
    */
    this.afterTuto();
  }

  gameOver() {
    this.isCinematic = true;
    this.isGameOver = true;
    dispatchUnlockEvents(["recyclingcentre_game_over"]);
    this.startDiscussion("recyclingCentre");
  }

  endGame() {
    gameDuration("recyclingCentre", this.timeStart);
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["recyclingcentre_after"]);
    });
  }

  listenDispatchedEvents(data) {
    if (eventsHas(data, "recyclingcentre_tuto_begin")) {
      this.tutoBegin();
    }
  }

  listenUnlockedEvents(data) {
    if (eventsHas(data, "recyclingcentre_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "recyclingcentre_end")) {
      this.endGame();
    }
  }

  tutoBegin() {
    this.isCinematic = false;
    this.firstStep = true;
  }

  tutoMissed() {
    dispatchUnlockEvents(["recyclingcentre_tuto_missed"]);
    this.isCinematic = true;
    this.startDiscussion("recyclingcentre");
  }

  tutoEnd() {
    this.isCinematic = true;
    dispatchUnlockEvents(["recyclingcentre_tuto_end"]);
    this.startDiscussion("recyclingcentre");
  }

  afterTuto() {
    this.isCinematic = false;
    this.firstStep = false;
    // start
    this.time.delayedCall(1500, () => this.initObject());
  }

  createControls() {
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.S)
      .on("down", () => {
        this.isCinematic = true;
      });

    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      down: "down",
      left: "left",
      right: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (event.key === "ArrowDown") {
          this.down();
        } else if (event.key === "ArrowLeft") {
          this.left();
        } else if (event.key === "ArrowRight") {
          this.right();
        } else if (event.keyCode === 32) {
          this.handleAction();
        }
      },
      this
    );

    this.input.keyboard.on(
      "keyup",
      (event) => {
        if (event.key === "ArrowLeft") {
          this.goingLeft = false;
        } else if (event.key === "ArrowRight") {
          this.goingRight = false;
        } else if (event.key === "ArrowDown") {
          this.goingDown = false;
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      const delta = 80;
      const arrowY = 225;

      const arrowStyle = {
        fontFamily: "DefaultFont",
        fontSize: "32px",
        fill: "#ffffff",
      };

      this.add
        .text(70, arrowY, "←", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(70, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(275, arrowY, "↑", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(275, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(480, arrowY, "→", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(480, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.input.on(
        "pointerdown",
        (pointer) => {
          if (pointer.x < 275 - delta) {
            this.left();
            return;
          }

          if (pointer.x > 275 + delta) {
            this.right();
            return;
          }

          this.handleAction();
        },
        this
      );
    }
  }

  handleAction() {
    if (this.isCinematic) return;
    super.handleAction();
    if (!this.currentObject) return;
    this.moveObjectToBottom();
  }

  right() {
    if (this.isCinematic) return;
    super.handleAction();
    if (!this.checkObjectSidePosition("left")) return;

    this.goingRight = true;
    this.matrixPosition++;
    this.currentObjectX--;
    for (const objectPosition of this.objects) objectPosition.object.x += STEP;
    for (const line of this.container) line.x += STEP;

    this.shadowObject.y = STEP * this.getAvailableY(this.currentObjectName, this.currentObjectX, this.currentObjectY);
  }

  left() {
    if (this.isCinematic) return;
    super.handleAction();
    if (!this.checkObjectSidePosition("right")) return;

    this.goingLeft = true;
    this.matrixPosition--;
    this.currentObjectX++;
    for (const objectPosition of this.objects) objectPosition.object.x -= STEP;
    for (const line of this.container) line.x -= STEP;

    this.shadowObject.y = STEP * this.getAvailableY(this.currentObjectName, this.currentObjectX, this.currentObjectY);
  }

  down() {
    if (this.isCinematic) return;
    super.handleAction();
    if (!this.checkObjectDownPosition()) {
      this.stopCurrentObject();
      return;
    }

    this.currentObject.y += STEP;
    this.currentObjectY++;
  }

  moveObjectToBottom() {
    this.currentObjectY = this.getAvailableY(this.currentObjectName, this.currentObjectX, this.currentObjectY);
    this.isCinematic = true;
    this.tweens.add({
      targets: this.currentObject,
      y: this.currentObjectY * STEP,
      ease: "Sine.easeInOut",
      duration: 100,
      onComplete: () => {
        this.isCinematic = false;
        this.stopCurrentObject();
      }
    });
  }

  getAvailableY(name, xInMatrix, yInMatrix) {
    for (let y = yInMatrix; y < MATRIX_SIZE.h; y++) {
      for (let x = 0; x < OBJECTSPECS[name].w; x++) {
        if (this.getMatrixPosition(xInMatrix + x, y + OBJECTSPECS[name].h)) {
          return y;
        }
      }
    }

    return (MATRIX_SIZE.h - OBJECTSPECS[name].h)
  }

  setCurrentObjectPositionInMatrix() {
    for (let x = 0; x < OBJECTSPECS[this.currentObjectName].w; x++) {
      for (let y = 0; y < OBJECTSPECS[this.currentObjectName].h; y++) {
        this.setMatrixPosition(
          this.currentObjectId,
          this.currentObjectName,
          this.currentObject,
          this.currentObjectX + x,
          this.currentObjectY + y
        );
      }
    }

    this.objects.push({
      id: this.currentObjectId,
      object: this.currentObject,
      name: this.currentObjectName,
      x: this.currentObjectX,
      y: this.currentObjectY,
    });
  }

  removeObjectPositionInMatrix(id) {
    const object = this.objects.filter((object) => object.id === id)?.[0];
    if (!object) return;

    const { x: xOrigin, y: yOrigin, name } = object;
    for (let x = 0; x < OBJECTSPECS[name].w; x++) {
      for (let y = 0; y < OBJECTSPECS[name].h; y++) {
        this.matrix[xOrigin + x][yOrigin + y] = null;
      }
    }
  }

  getMatrixPosition(x, y) {
    return this.matrix?.[x]?.[y];
  }

  setMatrixPosition(id, name, object, x, y) {
    if (!this.matrix[x]) this.matrix[x] = [];
    if (this.matrix[x][y]) {
      console.error(`Object exists in ${x} / ${y}`, this.matrix);
      throw new Error('Object exists')
    }
    this.matrix[x][y] = { id, name, object };
  }

  checkObjectSidePosition(side) {
    if (!this.currentObject) return;

    if (side === "left") {
      if (this.currentObjectX === 0) return false;

      for (let y = 0; y < OBJECTSPECS[this.currentObjectName].h; y++) {
        if (
          this.getMatrixPosition(
            this.currentObjectX - 1,
            this.currentObjectY + y
          )
        )
          return false;
      }
    }

    if (side === "right") {
      if (
        this.currentObjectX + OBJECTSPECS[this.currentObjectName].w ===
        MATRIX_SIZE.w
      )
        return false;

      for (let y = 0; y < OBJECTSPECS[this.currentObjectName].h; y++) {
        if (
          this.getMatrixPosition(
            this.currentObjectX + OBJECTSPECS[this.currentObjectName].w,
            this.currentObjectY + y
          )
        )
          return false;
      }
    }

    return true;
  }

  checkObjectDownPosition() {
    // last position
    if (
      this.currentObjectY + OBJECTSPECS[this.currentObjectName].h ===
      MATRIX_SIZE.h
    )
      return false;

    // there is an object under it
    for (let x = 0; x < OBJECTSPECS[this.currentObjectName].w; x++) {
      if (
        this.getMatrixPosition(
          this.currentObjectX + x,
          this.currentObjectY + OBJECTSPECS[this.currentObjectName].h
        )
      )
        return false;
    }

    return true;
  }

  // known issue: reset + move left/right in same time
  resetMatrixPosition() {
    const resetFactor = STEP * -this.matrixPosition;
    for (const objectPosition of this.objects) {
      this.tweens.add({
        targets: objectPosition.object,
        x: objectPosition.object.x + resetFactor,
        ease: "Sine.easeInOut",
        duration: 0,
      });
    }

    for (const line of this.container) {
      this.tweens.add({
        targets: line,
        x: line.x + resetFactor,
        ease: "Sine.easeInOut",
        duration: 0,
      });
    }
    this.matrixPosition = 0;
  }

  initObject(name, x, y) {
    if (this.isCinematic) return;

    if (this.objectsGroupValidated > 1  && !this.lastObjectWasDropped && 1 === Phaser.Math.Between(1, 3)) {
      this.isCinematic = true;
      this.updateMessage('Je t\'envoie un déchet, récupère le !');
      this.time.delayedCall(1500, () => this.moveObjectToBottom());
      this.lastObjectWasDropped = true;
    } else {
      this.lastObjectWasDropped = false;
    }

    this.currentObjectId++;
    this.resetMatrixPosition();

    this.currentObjectName =
      name || Phaser.Math.RND.pick(Object.keys(OBJECTSPECS));
    this.currentObjectX = x || Phaser.Math.Between(7, 13);
    this.currentObjectY = y || 0;

    if (this.currentObjectY === 0) {
      this.shadowObject = this.add
        .image(
          MATRIX_DELTA_X +
            this.matrixPosition * STEP +
            this.currentObjectX * STEP,
          STEP * this.getAvailableY(this.currentObjectName, this.currentObjectX, this.currentObjectY),
          "recycling",
          this.currentObjectName
        )
        .setAlpha(0.3)
        .setOrigin(0, 0);
    }

    this.currentObject = this.add
    .image(
      MATRIX_DELTA_X +
        this.matrixPosition * STEP +
        this.currentObjectX * STEP,
      this.currentObjectY * STEP,
      "recycling",
      this.currentObjectName
    )
    .setOrigin(0, 0);
  }

  stopCurrentObject() {
    this.setCurrentObjectPositionInMatrix();
    this.checkObjectsGroup();

    if (this.shadowObject) {
      this.shadowObject.destroy();
      this.shadowObject = null;
    }
    this.currentObject = null;
    this.time.delayedCall(500, () => this.initObject());
  }

  dropObjects() {
    console.log('dropObjects')
    for (const { id, name, x, y, object } of this.objects) {
      const availableY = this.getAvailableY(name, x, y);
      if (availableY === y) continue;

      console.log({ id, name, x, y, availableY, object })
      this.removeObjectPositionInMatrix(id);
      object.y = availableY * STEP
      this.currentObject = object;
      this.currentObjectId = id;
      this.currentObjectName = name;
      this.currentObjectX = x;
      this.currentObjectY = availableY;
      this.stopCurrentObject();
      //this.dropObjects();
      /*
      this.isCinematic = true;
      this.tweens.add({
        targets: object,
        y: availableY * STEP,
        ease: "Sine.easeInOut",
        duration: 100,
        onComplete: () => {
          this.isCinematic = false;
          this.currentObject = object;
          this.currentObjectId = id;
          this.currentObjectName = name;
          this.currentObjectX = x;
          this.currentObjectY = availableY;
          this.stopCurrentObject();
          this.dropObjects();
        }
      });
      */
      break;
    }
  }

  checkObjectsGroup() {
    for (const objectPosition of this.objects) {
      const foundObjects = [];
      foundObjects.push(objectPosition, ...this.getAround(objectPosition));

      const uniqueFoundObjects = uniqueObjects(foundObjects);
      for (const otherObjectPosition of uniqueFoundObjects) {
        uniqueFoundObjects.push(...this.getAround(otherObjectPosition));
      }

      const objectsToDelete = uniqueObjects(uniqueFoundObjects);
      
      if (objectsToDelete.length >= 3) {
        this.objectsGroupValidated++;
        for (const objectToDelete of objectsToDelete) {
          const { id, object } = objectToDelete;
          this.removeObjectPositionInMatrix(id);
          this.objects = this.objects.filter((object) => object.id !== id);
          this.tweens.add({
            targets: object,
            alpha: 0,
            ease: "Sine.easeInOut",
            duration: 500,
            onComplete: () => object.destroy(),
          });
        }

        //this.dropObjects();
        this.stepTime -= DECREMENTSTEPTIME;
        console.log("stepTime", this.stepTime)
      }
    }
  }

  getAround(objectPosition) {
    const foundObjects = [];
    const {  x, y, name } = objectPosition;
    if (!name) return [];

    for (let xPos = x; xPos < x + OBJECTSPECS[name].w; xPos++) {
      // on top
      const otherObjectOnTop = this.getMatrixPosition(xPos, y - 1);
      if (otherObjectOnTop?.name === name) {
        foundObjects.push(otherObjectOnTop);
      }

      // on bottom
      const otherObjectOnBottom = this.getMatrixPosition(
        xPos,
        y + OBJECTSPECS[name].h
      );
      if (otherObjectOnBottom?.name === name) {
        foundObjects.push(otherObjectOnBottom);
      }
    }

    for (let yPos = y; yPos < y + OBJECTSPECS[name].h; yPos++) {
      // on left
      const otherObjectOnLeft = this.getMatrixPosition(x - 1, yPos);
      if (otherObjectOnLeft?.name === name) {
        foundObjects.push(otherObjectOnLeft);
      }

      // on right
      const otherObjectOnRight = this.getMatrixPosition(
        x + OBJECTSPECS[name].w,
        yPos
      );
      if (otherObjectOnRight?.name === name) {
        foundObjects.push(otherObjectOnRight);
      }
    }

    return foundObjects;
  }

  update(time, delta) {
    if (this.isCinematic) return;
    if (!this.currentObject) return;

    if (this.lastTime < time - this.stepTime) {
      this.lastTime = time;

      /*
      if (this.goingLeft) this.left()
      else if (this.goingRight) this.right()
      */
      //this.currentObject.y += STEP
      this.down();
    }
  }
}
