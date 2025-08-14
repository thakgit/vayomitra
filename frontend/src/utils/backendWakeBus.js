// src/utils/backendWakeBus.js
let visible = false;
let subs = [];

export function setWakeVisible(v) {
  visible = v;
  subs.forEach((fn) => fn(visible));
}

export function subscribeWake(fn) {
  subs.push(fn);
  // push current state immediately
  fn(visible);
  return () => {
    subs = subs.filter((s) => s !== fn);
  };
}
