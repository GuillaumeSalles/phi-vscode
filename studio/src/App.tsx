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
import { electron, save } from "./bridge";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import { set, del, firstKey } from "./helpers/immutable-map";
import Home from "./pages/Home";
import { useRouter } from "./useRouter";
import { makeDefaultProject } from "./factories";
import { open } from "./fileUtils";
import Menu from "./components/Menu";
import uuid from "uuid/v4";
import _applyAction from "./actions/index";
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
  setRefs: (refs: T.Refs) => void
) {
  router.history.push("/");
  setRefs(refs);
  navigateToFirstComponentOrDefault(router, refs.components);
}

function createProject(router: Router, setRefs: (refs: T.Refs) => void) {
  initProject(router, makeDefaultProject(), setRefs);
}

async function openProject(router: Router, setRefs: (refs: T.Refs) => void) {
  const refs = await open();
  if (refs) {
    initProject(router, refs, setRefs);
  }
}

function App() {
  const mode = (window as any).__MODE__;

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
    console.log("EFFECT");
    if (mode === "VSCODE") {
      const refs = makeDefaultProject();
      setRefs(refs);
      history.push("/vscode/component");
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
          createProject(router, setRefs);
          break;
        case "open-project":
          await openProject(router, setRefs);
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

  useEffect(() => {
    function listener(e: MessageEvent) {
      console.log("MESSAGE");
      console.log(JSON.stringify(e));
    }

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [router, setRefs]);

  function onComponentChange(id: string, newComponent: T.Component) {
    setComponents(set(refs.components, id, newComponent));
  }

  function applyAction(action: T.Action) {
    setRefs(_applyAction(action, refs));
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
            onNewProjectClick={() => createProject(router, setRefs)}
            openProject={() => openProject(router, setRefs)}
            openExampleProject={refs => initProject(router, refs, setRefs)}
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
    </React.Fragment>
  );
}

export default App;
