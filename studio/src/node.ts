const r = (window as any).require;

export const electron = r("electron") as Electron.AllElectron;
const fs = r("fs") as typeof import("fs");
const util = r("util") as typeof import("util");

export const writeFile = util.promisify(fs.writeFile);
