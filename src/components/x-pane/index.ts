import "./style.css";
import * as UI from "core/ui";

const PANES = {
  "primary-sidebar": UI.PrimarySidebar,
  "secondary-sidebar": UI.SecondarySidebar,
  "activity-bar": UI.ActivityBar,
  "status-bar": UI.StatusBar,
};

export class PaneElement extends HTMLElement {
  #controller?: AbortController;

  constructor() {
    super();
  }

  connectedCallback() {
    this.#controller = new AbortController();
    const pane = PANES[this.id];

    if (pane) {
      this.replaceChildren(pane.render());

      pane.addEventListener("change", () => {
        this.replaceChildren(pane.render());
      });
    }
  }

  disconnectedCallback() {
    this.#controller!.abort();
    this.#controller = undefined;
  }
}

customElements.define("x-pane", PaneElement);
