import * as T from "./types";
import { electron, writeFile, readFile } from "./node";

export async function save(current: T.Refs): Promise<string | undefined> {
  const path =
    current.fileName === undefined
      ? electron.remote.dialog.showSaveDialog({
          title: "Save project",
          defaultPath: "NewProject.neptune"
        })
      : current.fileName;

  if (!path) {
    return;
  }
  try {
    await writeFile(
      path,
      JSON.stringify({
        colors: Array.from(current.colors.entries()).map(entry => ({
          id: entry[0],
          ...entry[1]
        })),
        fontSizes: Array.from(current.fontSizes.entries()).map(entry => ({
          id: entry[0],
          value: entry[1]
        })),
        fontWeights: Array.from(current.fontWeights.entries()).map(entry => ({
          id: entry[0],
          ...entry[1]
        })),
        fontFamilies: Array.from(current.fontFamilies.entries()).map(entry => ({
          id: entry[0],
          value: entry[1]
        })),
        lineHeights: Array.from(current.lineHeights.entries()).map(entry => ({
          id: entry[0],
          ...entry[1]
        })),
        breakpoints: Array.from(current.breakpoints.entries()).map(entry => ({
          id: entry[0],
          ...entry[1]
        })),
        components: Array.from(current.components.entries()).map(entry => ({
          id: entry[0],
          ...entry[1]
        }))
      })
    );
  } catch (er) {
    console.log(er);
  }

  return path;
}

function jsonToRefs(fileName: string, data: any): T.Refs {
  return {
    fileName,
    components: new Map(),
    fontSizes: new Map(),
    fontWeights: new Map(),
    fontFamilies: new Map(),
    breakpoints: new Map(),
    lineHeights: new Map(),
    colors: new Map(
      data.colors.map((color: any) => {
        const { id, ...rest } = color;
        return [id, rest];
      })
    )
  };
}

export async function open(): Promise<T.Refs | undefined> {
  const path = electron.remote.dialog.showOpenDialog({});
  if (!path) {
    return;
  }

  try {
    const str = await readFile(path[0], "utf-8");
    const data = JSON.parse(str);
    return jsonToRefs(path[0], data);
  } catch (er) {
    console.log(er);
    return;
  }
}
