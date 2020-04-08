import * as T from "./types";
import { refsToJson } from "./refsUtil";

const actionTypesToIgnoreForUndoRedo = new Set<T.ActionType>([
  "selectLayer",
  "hoverLayer",
  "editComponent",
  "stopEditComponent",
]);

function onAction(action: T.Action, refs: T.Refs) {
  if ((window as any).__vscode__ == null) {
    return;
  }

  if (actionTypesToIgnoreForUndoRedo.has(action.type)) {
    return;
  }

  const vscode = (window as any).__vscode__.api;
  const value = refsToJson(refs);
  vscode.setState({ value });
  vscode.postMessage({
    type: "edit",
    value,
  });
}

export default function () {
  return {
    electron: {
      ipcRenderer: {
        on: () => {},
        removeListener: () => {},
      },
      remote: {
        dialog: {
          showOpenDialog: (options: any) => {
            throw new Error("Not implemented");
          },
          showSaveDialog: () => {
            throw new Error("Not implemented");
          },
        },
      },
    },
    writeFile: () => {
      throw new Error("Not implemented");
    },
    readFile: () => {
      throw new Error("Not implemented");
    },
    save: async () => {
      throw new Error("Not implemented");
    },
    onAction,
  };
}
