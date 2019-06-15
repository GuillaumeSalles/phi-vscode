import * as T from "./types";
import { electron, writeFile } from "./node";

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
