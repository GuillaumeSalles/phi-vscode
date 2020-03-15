import * as T from "./types";
import { electron, readFile } from "./bridge";
import { makeDefaultArtboards } from "./factories";

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
    uiState: {
      type: "typography"
    },
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
