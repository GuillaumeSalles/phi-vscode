import * as T from "./types";

export default function() {
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
            defaultPath: "NewProject.phi"
          })
        : current.fileName;

    if (!path) {
      return;
    }
    try {
      await writeFile(
        path,
        JSON.stringify({
          colors: mapToArray(current.colors),
          fontSizes: mapToArray(current.fontSizes),
          fontFamilies: mapToArray(current.fontFamilies),
          breakpoints: mapToArray(current.breakpoints),
          components: mapToArray(current.components)
        })
      );
    } catch (er) {
      console.log(er);
    }

    return path;
  }

  function mapToArray(map: Map<string, any>) {
    return Array.from(map.entries()).map(entry => ({
      id: entry[0],
      ...entry[1]
    }));
  }

  return {
    save,
    writeFile,
    readFile,
    electron,
    onAction: () => {}
  };
}
