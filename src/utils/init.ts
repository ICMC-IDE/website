import * as VirtualFilesystem from "@icmc-ide/core/fs";
/**
This file is responsible for validating the project root and creating a new project instance if the project root is empty.

No validation should be done if running inside a worker.
*/

// TODO: set the version to the current version of the project before releasing
const VERSION: number = 0 / 0;

/**
 * Upgrade the project root
 */
async function upgrade(currentVersion: number) {
  console.log(
    "[CORE] Upgrading project root from version",
    currentVersion,
    "to",
    VERSION,
  );
  localStorage.setItem("program.version", VERSION.toString());
}

/**
 * Initialize the project root
 */
async function init() {
  console.log("[CORE] Initializing project root");

  const root = new VirtualFilesystem.VirtualDirectory(
    "",
    undefined,
    await navigator.storage.getDirectory(),
  );

  const [projects, extensions] = await Promise.all([
    root.touch("projects", true),
    root.touch("extensions", true),
  ]);

  console.log(root, projects, extensions);

  // TODO: uncomment the following line before releasing
  // localStorage.setItem("program.version", VERSION.toString());
}

if (
  typeof WorkerGlobalScope !== "undefined" &&
  self instanceof WorkerGlobalScope
) {
  // Running inside a worker
  // Do nothing
  console.log("[CORE] Running inside a worker");
} else {
  console.log("[CORE] Running inside the main thread");

  const version = localStorage.getItem("program.version");

  if (version === null) {
    await init();
  } else {
    const currentVersion = parseInt(version);

    if (currentVersion !== VERSION) {
      await upgrade(currentVersion);
    }
  }
}
