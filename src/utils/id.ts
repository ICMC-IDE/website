/*
 * Returns an unique ID
 */

let last = 0;

export function generate() {
  return `${Date.now().toString(36).padStart(8, "0")}-${
    (last++).toString(36).padStart(8, "0")
  }`;
}
