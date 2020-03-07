import * as T from "./types";

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
    onAction: (action: T.Action) => {
      if ((window as any).__vscode__) {
        const vscode = (window as any).__vscode__;
        vscode.postMessage({ type: "action", action });
      }
    }
  };
}
