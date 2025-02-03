import "./style.css";

import App from "@icmc-ide/core/app";

// TODO: fix this
import css from "./style.css?inline";

const style = new CSSStyleSheet();
style.replaceSync(css);

export class ViewElement extends HTMLElement {
  static observedAttributes = ["uri"];

  /** The shadow root is closed to prevent other scripts from accessing it. */
  #shadowRoot!: ShadowRoot;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "closed" });
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "uri") {
      this.#load(new URL(newValue));
    }
  }

  async #load(uri: URL) {
    try {
      const result = await App.query(uri);

      if (result instanceof HTMLElement) {
        const extension = await App.resolve(uri);

        this.#shadowRoot.adoptedStyleSheets = extension.stylesheet
          ? [style, extension.stylesheet]
          : [style];

        this.#shadowRoot.replaceChildren(result);
      } else {
        console.error(`[ERR][VIEW] Invalid result for URI: ${uri.toString()}`);
      }
    } catch (error) {
      console.error(`[ERR][VIEW] Could not load URI: ${uri.toString()}`, error);
    }
  }
}

customElements.define("x-view", ViewElement);
