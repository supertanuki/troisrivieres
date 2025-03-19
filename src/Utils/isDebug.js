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

/*
// @to remove
this.input.on("pointerdown", (pointer) =>
  console.log(pointer.x, pointer.y)
);
*/