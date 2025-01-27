export function SVG(callback: () => JSX.Element): JSX.Element {
  const _element = globalThis._element;
  globalThis._element = globalThis._elementns;

  globalThis._namespace = "http://www.w3.org/2000/svg";

  const result = callback();

  globalThis._element = _element;

  return result;
}
