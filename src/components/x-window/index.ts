import "./style.css";
import template from "./template.html?template";

import * as ID from "../../utils/id";

export class WindowElement extends HTMLElement {
  static observedAttributes = ["active"];

  active: string = "";
  name: string = ID.generate();

  #controller?: AbortController;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#controller = new AbortController();
    const tabs = this.shadowRoot!.querySelector(
      "[part=tabs]",
    ) as HTMLDivElement;

    tabs.addEventListener(
      "click",
      (event: Event) => {
        let target = event.target as HTMLButtonElement;

        while (target && target.tagName !== "BUTTON") {
          target = target.parentElement as HTMLButtonElement;
        }

        this.setAttribute("active", target.value);
      },
      { signal: this.#controller.signal },
    );
  }

  disconnectedCallback() {
    this.#controller!.abort();
    this.#controller = undefined;
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "active") {
      const tabs = this.querySelectorAll("[slot=tab]");
      const views = this.querySelectorAll("[slot=view]");

      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i] as HTMLButtonElement;
        const view = views[i] as HTMLElement;

        tab.classList.toggle("active", tab.value === newValue);
        view.classList.toggle("active", view.id === newValue);
      }
    }
  }

  /**
   * Open a new view in the window element with the given URI.
   * @param uri
   */
  open(uri: string) {
    const id = ID.generate();

    {
      const tab = document.createElement("button");
      const span = document.createElement("span");

      tab.slot = "tab";
      tab.value = id;

      span.innerText = id;

      tab.appendChild(span);
      this.appendChild(tab);
    }
    {
      const view = document.createElement("x-view");
      view.setAttribute("uri", uri);

      view.slot = "view";
      view.id = id;

      this.appendChild(view);
    }

    this.setAttribute("active", id);
  }
}

customElements.define("x-window", WindowElement);
