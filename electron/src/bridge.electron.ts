import * as T from "./types";
import { refsToJson } from "./refsUtil";

export default function () {
  const r = (window as any).require;
  const fs = r("fs") as typeof import("fs");
  const util = r("util") as typeof import("util");

  const writeFile = util.promisify(fs.writeFile);
  const readFile = util.promisify(fs.readFile);

  const electron = r("electron");

  async function save(current: T.Refs) {
    const path =
      current.fileName === undefined
        ? electron.remote.dialog.showSaveDialog({
            title: "Save project",
            defaultPath: "NewProject.phi",
          })
        : current.fileName;

    if (!path) {
      return;
    }
    try {
      await writeFile(path, refsToJson(current));
    } catch (er) {
      console.log(er);
    }

    return path;
  }

  return {
    save,
    writeFile,
    readFile,
    electron,
    onAction: () => {},
  };
}
