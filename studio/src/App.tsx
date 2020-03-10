/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useEffect, useRef, useCallback } from "react";
import * as T from "./types";
import { useState } from "react";
import { electron, save, onAction } from "./bridge";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import { set } from "./helpers/immutable-map";
import Home from "./pages/Home";
import { makeDefaultProject } from "./factories";
import { open, jsonToRefs } from "./fileUtils";
import Menu from "./components/Menu";
import _applyAction, { applyActions, undo } from "./actions/index";

function initProject(refs: T.Refs, applyAction: (action: T.Action) => void) {
  applyAction({ type: "initProject", refs });
}

function createProject(applyAction: (action: T.Action) => void) {
  initProject(makeDefaultProject(), applyAction);
}

async function openProject(applyAction: (action: T.Action) => void) {
  const refs = await open();
  if (refs) {
    initProject(refs, applyAction);
  }
}

const actionsStack: T.Action[] = [];

function App() {
  const mode = (window as any).__MODE__;
  const initialState = (window as any).__initialState__;

  const [refs, setRefs] = useState<T.Refs>({
    uiState: {
      type: "home"
    },
    isSaved: true,
    fileName: undefined,
    components: new Map(),
    artboards: new Map(),
    colors: new Map(),
    fontFamilies: new Map(),
    fontSizes: new Map(),
    breakpoints: new Map()
  });

  useEffect(() => {
    if (mode === "VSCODE") {
      if (initialState) {
        setRefs(jsonToRefs(undefined, true, initialState));
      } else {
        setRefs(makeDefaultProject());
      }
    }
  }, [mode]);

  function setParialRefs(partialRefs: Partial<T.Refs>) {
    setRefs({
      ...refs,
      ...partialRefs
    });
  }

  function setComponents(components: T.ComponentMap) {
    setParialRefs({
      components,
      isSaved: false
    });
  }

  const fresh = useRef<T.Refs>(refs);
  useEffect(() => {
    fresh.current = refs;
  });

  useEffect(() => {
    async function listener(event: any, message: string) {
      switch (message) {
        case "new-project":
          createProject(applyAction);
          break;
        case "open-project":
          await openProject(applyAction);
          break;
        case "save-project":
          const fileName = await save(fresh.current);
          if (fileName) {
            setParialRefs({
              fileName,
              isSaved: true
            });
          }
          break;
      }
    }
    electron.ipcRenderer.on("actions", listener);
    return () => {
      electron.ipcRenderer.removeListener("actions", listener);
    };
  }, [setRefs, setParialRefs]);

  const undoAction = useCallback(() => {
    console.group("Undo");
    const newRefs = undo(actionsStack);
    console.log("New State", newRefs);
    console.groupEnd();
    setRefs(newRefs);
  }, []);

  function applyAction(action: T.Action) {
    console.group("Apply Action");
    console.log("Action: ", action);
    console.log("Actions Stack: ", actionsStack);
    const newRefs = _applyAction(actionsStack, action, refs);
    console.log("New State: ", newRefs);
    console.groupEnd();
    onAction(action, newRefs);
    setRefs(newRefs);
  }

  useEffect(() => {
    function listener(e: MessageEvent) {
      if (e.data.type === "undo") {
        undoAction();
      } else if (e.data.type === "applyActions") {
        const actions = e.data.actions as T.Action[];
        setRefs(applyActions(actionsStack, actions, refs));
      }
    }

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [refs]);

  function onComponentChange(id: string, newComponent: T.Component) {
    setComponents(set(refs.components, id, newComponent));
  }

  function menu() {
    return (
      <Menu
        applyAction={applyAction}
        uiState={refs.uiState}
        components={refs.components}
      />
    );
  }

  const uiState = refs.uiState;

  switch (uiState.type) {
    case "typography":
      return (
        <Typography
          menu={menu()}
          refs={refs}
          fontFamilies={refs.fontFamilies}
          onFontFamiliesChange={fontFamilies => {
            setParialRefs({
              fontFamilies,
              isSaved: false
            });
          }}
          fontSizes={refs.fontSizes}
          onFontSizesChange={fontSizes => {
            setParialRefs({
              fontSizes,
              isSaved: false
            });
          }}
        />
      );
      break;
    case "home":
      return (
        <Home
          onNewProjectClick={() => createProject(applyAction)}
          openProject={() => openProject(applyAction)}
          openExampleProject={refs => initProject(refs, applyAction)}
        />
      );
      break;
    case "component":
      return (
        <ComponentView
          menu={menu()}
          componentId={uiState.componentId}
          layerId={uiState.layerId}
          refs={refs}
          applyAction={applyAction}
        />
      );
    case "colors":
      return (
        <Colors
          menu={menu()}
          refs={refs}
          colors={refs.colors}
          onColorsChange={colors => {
            setParialRefs({
              colors,
              isSaved: false
            });
          }}
        />
      );
      break;
    case "breakpoints":
      return (
        <Breakpoints
          refs={refs}
          menu={menu()}
          breakpoints={refs.breakpoints}
          onBreakpointsChange={breakpoints => {
            setParialRefs({
              breakpoints,
              isSaved: false
            });
          }}
        />
      );
  }
}

export default App;
