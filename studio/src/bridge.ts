import * as T from "./types";
import electronBridge from "./bridge.electron";
import electronVscode from "./bridge.vscode";

const r = (window as any).require;

type API = {
  electron: {
    ipcRenderer: {
      on: (
        event: string,
        callback: (event: string, message: string) => void
      ) => void;
      removeListener: (
        event: string,
        callback: (event: string, message: string) => void
      ) => void;
    };
    remote: {
      dialog: {
        showSaveDialog: ({
          title,
          defaultPath
        }: {
          title: string;
          defaultPath: string;
        }) => void;
        showOpenDialog: (options: any) => string | undefined;
      };
    };
  };
  writeFile: (path: string, content: string) => Promise<void>;
  readFile: (path: string, encoding: string) => Promise<string>;
  save: (refs: T.Refs) => Promise<string | undefined>;
  onAction: (action: T.Action) => void;
  //path: typeof import("path")
};

const api: API = r ? electronBridge() : electronVscode();

export const electron = api.electron;
export const readFile = api.readFile;
export const writeFile = api.writeFile;
export const save = api.save;
export const onAction = api.onAction;
