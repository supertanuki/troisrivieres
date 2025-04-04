const params = new URLSearchParams(window.location.search);

export function isDebug() {
  return params.has("debug");
}

export function urlParamHas(param) {
  return params.has(param);
}

export function getUrlParam(name, defaultValue) {
  return Number(params.get(name)) || defaultValue
}

export function gameDuration(label, timeStart) {
  const durationTime = Math.round((Date.now() - timeStart) / 1000);
  console.log("*** Game duration for: " + label, durationTime);
}

/*
// @to remove
this.input.on("pointerdown", (pointer) =>
  console.log(pointer.x, pointer.y)
);
*/