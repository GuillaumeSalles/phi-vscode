/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useEffect, useRef } from "react";
import * as T from "./types";
import { useState } from "react";
import { Route } from "react-router";
import { electron } from "./node";
import { lineHeights } from "./state";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import { set } from "./helpers/immutable-map";
import Home from "./pages/Home";
import { useRouter } from "./useRouter";
import { makeDefaultProject } from "./factories";
import { save, open } from "./actions";

function App() {
  const router = useRouter();

  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [components, setComponents] = useState<Map<string, T.Component>>(
    new Map()
  );
  const [colors, setColors] = useState<T.ColorsMap>(new Map());
  const [fontWeights, setFontWeights] = useState<T.FontWeightsMap>(new Map());
  const [fontFamilies, setFontFamilies] = useState<T.FontFamiliesMap>(
    new Map()
  );
  const [fontSizes, setFontSizes] = useState<T.FontSizesMap>(new Map());
  const [breakpoints, setBreakpoints] = useState<T.BreakpointsMap>(new Map());
  const refs: T.Refs = {
    fileName,
    colors,
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    breakpoints,
    components
  };

  const fresh = useRef<T.Refs>(refs);
  useEffect(() => {
    fresh.current = refs;
  });

  useEffect(() => {
    async function listener(event: string, message: string) {
      if (message === "save") {
        const fileName = await save(fresh.current);
        setFileName(fileName);
      } else if (message === "open") {
        const refs = await open();
        if (refs) {
          setColors(refs.colors);
          setFileName(refs.fileName);
          router.history.push("/colors");
        }
      }
    }
    electron.ipcRenderer.on("actions", listener);
    return () => {
      electron.ipcRenderer.removeListener("actions", listener);
    };
  }, []);

  function setComponent(id: string, newComponent: T.Component) {
    setComponents(set(components, id, newComponent));
  }

  function createProject() {
    const project = makeDefaultProject();
    setColors(project.colors);
    setFontSizes(project.fontSizes);
    setFontWeights(project.fontWeight);
    setFontFamilies(project.fontFamilies);
    setBreakpoints(project.breakpoints);
    setComponents(project.components);
    router.history.push(
      `/components/${Array.from(project.components.keys())[0]}`
    );
  }

  return (
    <React.Fragment>
      <Route
        path="/"
        exact
        render={() => <Home onNewProjectClick={createProject} />}
      />
      <Route
        path="/typography"
        render={() => (
          <Typography
            components={components}
            fontFamilies={fontFamilies}
            onFontFamiliesChange={fontFamilies => setFontFamilies(fontFamilies)}
            fontSizes={fontSizes}
            onFontSizesChange={fontSizes => setFontSizes(fontSizes)}
          />
        )}
      />
      <Route
        path="/colors"
        render={() => (
          <Colors
            components={components}
            colors={colors}
            onColorsChange={colors => setColors(colors)}
          />
        )}
      />
      <Route
        path="/breakpoints"
        render={() => (
          <Breakpoints
            components={components}
            breakpoints={breakpoints}
            onBreakpointsChange={breakpoints => setBreakpoints(breakpoints)}
          />
        )}
      />
      <Route
        path="/components/:id"
        render={props => {
          const component = components.get(props.match.params.id);
          if (component == null) {
            throw new Error("Component not found");
          }
          return (
            <ComponentView
              components={components}
              component={component}
              onComponentChange={component =>
                setComponent(props.match.params.id, component)
              }
              refs={refs}
            />
          );
        }}
      />
    </React.Fragment>
  );
}

export default App;
