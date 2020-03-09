/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useEffect, useRef, useCallback } from "react";
import * as T from "./types";
import { useState } from "react";
import {
  Route,
  RouteComponentProps,
  StaticContext,
  useHistory
} from "react-router";
import { electron, save, onAction } from "./bridge";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import { set, del, firstKey } from "./helpers/immutable-map";
import Home from "./pages/Home";
import { useRouter } from "./useRouter";
import { makeDefaultProject } from "./factories";
import { open, jsonToRefs } from "./fileUtils";
import Menu from "./components/Menu";
import uuid from "uuid/v4";
import _applyAction, { applyActions, undo } from "./actions/index";
import VsCodeComponent from "./pages/ComponentView/VsCodeComponent";

type Router = RouteComponentProps<{}, StaticContext, any>;

function navigateToFirstComponentOrDefault(
  router: Router,
  components: T.ComponentMap
) {
  router.history.push(
    components.size > 0 ? `/components/${firstKey(components)}` : `/typography`
  );
}

function initProject(
  router: Router,
  refs: T.Refs,
  applyAction: (action: T.Action) => void
) {
  router.history.push("/");
  applyAction({ type: "initProject", refs });
  navigateToFirstComponentOrDefault(router, refs.components);
}

function createProject(
  router: Router,
  applyAction: (action: T.Action) => void
) {
  initProject(router, makeDefaultProject(), applyAction);
}

async function openProject(
  router: Router,
  applyAction: (action: T.Action) => void
) {
  const refs = await open();
  if (refs) {
    initProject(router, refs, applyAction);
  }
}

const actionsStack: T.Action[] = [];

function App() {
  const mode = (window as any).__MODE__;
  const initialState = (window as any).__initialState__;

  const router = useRouter();
  const history = useHistory();

  const [refs, setRefs] = useState<T.Refs>({
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
      history.push("/typography");
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
          createProject(router, applyAction);
          break;
        case "open-project":
          await openProject(router, applyAction);
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
  }, [router, setRefs, setParialRefs]);

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
  }, [router, refs]);

  function onComponentChange(id: string, newComponent: T.Component) {
    setComponents(set(refs.components, id, newComponent));
  }

  function menu() {
    return (
      <Menu
        components={refs.components}
        onAddComponent={name => {
          const id = uuid();
          setComponents(
            set(refs.components, id, { name, props: [], examples: [] })
          );
          router.history.push(`/components/${id}`);
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <Route
        path="/"
        exact
        render={() => (
          <Home
            onNewProjectClick={() => createProject(router, applyAction)}
            openProject={() => openProject(router, applyAction)}
            openExampleProject={refs => initProject(router, refs, applyAction)}
          />
        )}
      />
      <Route
        path="/typography"
        render={() => (
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
        )}
      />
      <Route
        path="/colors"
        render={() => (
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
        )}
      />
      <Route
        path="/breakpoints"
        render={() => (
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
        )}
      />
      <Route
        path="/components/:id"
        render={props => {
          return (
            <ComponentView
              menu={menu()}
              componentId={props.match.params.id}
              onComponentChange={onComponentChange}
              onDelete={id => {
                const newComponents = del(refs.components, id);
                navigateToFirstComponentOrDefault(router, newComponents);
                setComponents(newComponents);
              }}
              refs={refs}
              applyAction={applyAction}
            />
          );
        }}
      />
      <Route
        path="/vscode/component"
        render={props => {
          return (
            <VsCodeComponent
              componentId={firstKey(refs.components)}
              onComponentChange={onComponentChange}
              refs={refs}
              applyAction={applyAction}
            />
          );
        }}
      />
      <button onClick={undoAction}>Undo</button>
    </React.Fragment>
  );
}

export default App;
