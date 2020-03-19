/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useRef, useCallback } from "react";
import * as T from "./types";
import { useState } from "react";
import { onAction } from "./bridge";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import Home from "./pages/Home";
import { makeDefaultProject } from "./factories";
import { open, jsonToRefs } from "./fileUtils";
import Menu from "./components/Menu";
import _applyAction from "./actions/index";

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

function makeInitialState(): T.Refs {
  const vscode = (window as any).__vscode__;
  if (vscode && vscode.initialState) {
    return jsonToRefs(undefined, true, (window as any).__vscode__.initialState);
  }
  return makeDefaultProject();
}

const initialState = makeInitialState();

function App() {
  const [refs, setRefs] = useState<T.Refs>(initialState);

  useEffect(() => {
    return () => {
      console.log("Destroy ");
    };
  }, []);

  const applyAction = useCallback(
    (action: T.Action) => {
      console.group("Apply Action");
      console.log("Action: ", action);
      const newRefs = _applyAction(action, refs);
      console.log("New State: ", newRefs);
      console.groupEnd();
      onAction(action, newRefs);
      setRefs(newRefs);
    },
    [refs]
  );

  useEffect(() => {
    function listener(e: MessageEvent) {
      if (e.data.type === "setValue") {
        console.log("Set value");
        setRefs(jsonToRefs(undefined, true, JSON.parse(e.data.value)));
      }
    }

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

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
          fontSizes={refs.fontSizes}
          applyAction={applyAction}
        />
      );
    case "home":
      return (
        <Home
          onNewProjectClick={() => createProject(applyAction)}
          openProject={() => openProject(applyAction)}
          openExampleProject={refs => initProject(refs, applyAction)}
        />
      );
    case "component":
      return (
        <ComponentView
          key="ComponentView"
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
          applyAction={applyAction}
        />
      );
    case "breakpoints":
      return (
        <Breakpoints
          refs={refs}
          menu={menu()}
          breakpoints={refs.breakpoints}
          applyAction={applyAction}
        />
      );
  }
}

export default App;
