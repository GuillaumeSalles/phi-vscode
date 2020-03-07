export default function () {

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
      
    }
  }
}