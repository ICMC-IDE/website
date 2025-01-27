import "./style.css";
import template from "./template.html?template";

export default class ResizableElement extends HTMLElement {
  static observedAttributes = ["dir", "ratio"];

  #controller?: AbortController;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#controller = new AbortController();
    const handle = this.shadowRoot!.querySelector(
      "[part=handle]",
    ) as HTMLDivElement;

    handle.addEventListener(
      "pointerdown",
      (event) => {
        event.preventDefault();
        handle.setPointerCapture(event.pointerId);
      },
      { signal: this.#controller.signal },
    );

    handle.addEventListener(
      "pointermove",
      (event) => {
        if (!handle.hasPointerCapture(event.pointerId)) {
          return;
        }

        const bbox = this.getBoundingClientRect();

        const ratio =
          this.getAttribute("dir") === "vertical"
            ? (event.y - bbox.y) / bbox.height
            : (event.x - bbox.x) / bbox.width;

        this.style.setProperty("--ratio", ratio.toString());
      },
      { signal: this.#controller.signal },
    );

    handle.addEventListener(
      "pointerup",
      (event) => {
        handle.releasePointerCapture(event.pointerId);
      },
      { signal: this.#controller.signal },
    );
  }

  disconnectedCallback() {
    this.#controller!.abort();
    this.#controller = undefined;
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "ratio") {
      this.style.setProperty("--ratio", newValue);
    }
  }

  closeRight() {
    this.replaceWith(this.lastChild!);
  }

  closeLeft() {
    this.replaceWith(this.firstChild!);
  }
}

customElements.define("x-resizable", ResizableElement);
