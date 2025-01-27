type Id = string;

export enum WindowType {
  LEAF = "leaf",
  BRANCH = "branch",
  ROOT = "root",
}

export type WindowLeaf = {
  id: Id;
  type: WindowType.LEAF;
  title: string;
  uri: string;
};

export type WindowBranch = {
  type: WindowType.BRANCH;
  active: Id;
  children: WindowLeaf[];
};

export type WindowRoot = {
  type: WindowType.ROOT;
  ratio: number;
  direction: "vertical" | "horizontal";
  left: WindowRoot | WindowBranch;
  right: WindowRoot | WindowBranch;
};
