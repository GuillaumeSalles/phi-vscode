import * as T from "./types";
import { jsonToRefs } from "./fileUtils";
import { refsToJson } from "./refsUtil";

export default function() {
  return {
    electron: {
      ipcRenderer: {
        on: () => {},
        removeListener: () => {}
      },
      remote: {
        dialog: {
          showOpenDialog: (options: any) => {
            throw new Error("Not implemented");
          },
          showSaveDialog: () => {
            throw new Error("Not implemented");
          }
        }
      }
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
    onAction: (action: T.Action, refs: T.Refs) => {
      if ((window as any).__vscode__) {
        const vscode = (window as any).__vscode__.api;
        vscode.postMessage({ type: "action", action, data: refsToJson(refs) });
      }
    }
  };
}
