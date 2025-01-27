import "./style.css";
import "../../components";

import "../../utils/init";

import type { WindowElement } from "../../components";
import * as Extension from "core/extension";

import * as EditorTools from "../../utils/editor";

const data: EditorTools.WindowRoot = {
  type: EditorTools.WindowType.ROOT,
  direction: "horizontal",
  ratio: 0.5,
  left: {
    type: EditorTools.WindowType.BRANCH,
    active: "00000001-0000-0000-0000-000000000000",
    children: [
      {
        id: "00000001-0000-0000-0000-000000000000",
        type: EditorTools.WindowType.LEAF,
        title: "File 1",
        uri: "core:///text?path=/",
      },
      {
        id: "00000002-0000-0000-0000-000000000000",
        type: EditorTools.WindowType.LEAF,
        title: "File 2",
        uri: "core:///text?path=/",
      },
    ],
  },
  right: {
    type: EditorTools.WindowType.BRANCH,
    active: "00000003-0000-0000-0000-000000000000",
    children: [
      {
        id: "00000003-0000-0000-0000-000000000000",
        type: EditorTools.WindowType.LEAF,
        title: "File 2",
        uri: "core:///bin?path=/",
      },
    ],
  },
};

function buildBranch(branch: EditorTools.WindowBranch): HTMLElement {
  const win = document.createElement("x-window") as WindowElement;

  for (let i = 0, children = branch.children; i < children.length; i++) {
    win.open(children[i].uri);
  }

  return win;
}

function buildWindowTree(root: EditorTools.WindowRoot): HTMLElement {
  const rootElement = document.createElement("x-resizable");

  rootElement.setAttribute("dir", root.direction);
  rootElement.setAttribute("ratio", root.ratio.toString());

  const left =
    root.left.type === EditorTools.WindowType.ROOT
      ? buildWindowTree(root.left)
      : buildBranch(root.left);

  left.slot = "left";

  const right =
    root.right.type === EditorTools.WindowType.ROOT
      ? buildWindowTree(root.right)
      : buildBranch(root.right);

  right.slot = "right";

  rootElement.appendChild(left);
  rootElement.appendChild(right);

  return rootElement;
}

async function load() {
  // self.URL is a workaround for the global URL object because the bundler fucks it up for some reason
  await Extension.load(new self.URL("/extensions/core/", import.meta.url));
  await Extension.load(new self.URL("/extensions/icmc/", import.meta.url));
}

async function start() {
  const root = buildWindowTree(data);
  document.body.querySelector("#editor")!.appendChild(root);
}

(async () => {
  await load();
  await start();
})();
