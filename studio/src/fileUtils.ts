import * as T from "./types";
import { electron, writeFile, readFile } from "./node";
import { makeDefaultArtboards } from "./factories";

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

function arrayToMap(array: any[]) {
  return new Map(
    array.map((item: any) => {
      const { id, ...rest } = item;
      return [id, rest];
    })
  );
}

export function jsonToRefs(
  fileName: string | undefined,
  isSaved: boolean,
  data: any
): T.Refs {
  return {
    isSaved,
    fileName,
    artboards: makeDefaultArtboards(),
    components: arrayToMap(data.components),
    fontSizes: arrayToMap(data.fontSizes),
    fontFamilies: arrayToMap(data.fontFamilies),
    breakpoints: arrayToMap(data.breakpoints),
    colors: arrayToMap(data.colors)
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
    return jsonToRefs(path[0], true, data);
  } catch (er) {
    console.log(er);
    return;
  }
}
