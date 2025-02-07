const params = new URLSearchParams(window.location.search);

export function isDebug() {
  return params.has("debug");
}

export function isScene1() {
    return params.has("scene1");
}

export function isFactory() {
  return params.has("factory");
}

export function isMine() {
  return params.has("mine");
}

export function isCable() {
  return params.has("cable");
}