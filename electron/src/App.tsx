/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useCallback } from "react";
import * as T from "./types";
import { useState } from "react";
import { onAction } from "./bridge";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import { makeDefaultProject } from "./factories";
import { jsonToRefs } from "./fileUtils";
import Menu from "./components/Menu";
import _applyAction from "./actions/index";
import fakeProject from "./mockInitialState.json";

function makeInitialState(): T.Refs {
  const vscode = (window as any).__vscode__;
  if (vscode) {
    if (vscode.initialState) {
      return jsonToRefs(undefined, true, vscode.initialState);
    } else {
      return makeDefaultProject();
    }
  }
  return jsonToRefs(undefined, true, fakeProject);
}

const initialState = makeInitialState();

function App() {
  const [refs, setRefs] = useState<T.Refs>(initialState);

  const applyAction = useCallback(
    (action: T.Action) => {
      console.group("Apply Action");
      console.log("Action: ", action);
      const newRefs = _applyAction(action, refs);
      if (newRefs === refs) {
        return;
      }
      console.log("New State: ", newRefs);
      console.groupEnd();
      onAction(action, newRefs);
      setRefs(newRefs);
    },
    [refs]
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      applyAction({
        type: "globalShortcutAction",
        key: event.key,
        metaKey: event.metaKey
      });

      // Disable navigate back on Chrome
      if (event.key === "ArrowLeft" && event.metaKey) {
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [applyAction, refs]);

  useEffect(() => {
    function listener(e: MessageEvent) {
      if (e.data.type === "setValue") {
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
