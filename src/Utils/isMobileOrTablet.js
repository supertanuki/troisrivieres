export default function isMobileOrTablet() {
  return (
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    window.matchMedia("(pointer: coarse)").matches
  );
}
