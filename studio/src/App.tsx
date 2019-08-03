/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useEffect, useRef, useCallback } from "react";
import * as T from "./types";
import { useState } from "react";
import { Route } from "react-router";
import { electron } from "./node";
import { lineHeights } from "./state";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";
import { set, del, firstKey } from "./helpers/immutable-map";
import Home from "./pages/Home";
import { useRouter } from "./useRouter";
import { makeDefaultProject } from "./factories";
import { save, open } from "./actions";
import Menu from "./components/Menu";
import uuid from "uuid/v4";

function App() {
  const router = useRouter();

  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [components, setComponents] = useState<T.ComponentMap>(new Map());
  const [colors, setColors] = useState<T.ColorsMap>(new Map());
  const [fontWeights, setFontWeights] = useState<T.FontWeightsMap>(new Map());
  const [fontFamilies, setFontFamilies] = useState<T.FontFamiliesMap>(
    new Map()
  );
  const [fontSizes, setFontSizes] = useState<T.FontSizesMap>(new Map());
  const [breakpoints, setBreakpoints] = useState<T.BreakpointsMap>(new Map());
  const refs: T.Refs = {
    isSaved,
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
        if (fileName) {
          setFileName(fileName);
          setIsSaved(true);
        }
      } else if (message === "open") {
        const refs = await open();
        if (refs) {
          setFileName(refs.fileName);
          setColors(refs.colors);
          setFontSizes(refs.fontSizes);
          setFontWeights(refs.fontWeights);
          setFontFamilies(refs.fontFamilies);
          setBreakpoints(refs.breakpoints);
          setComponents(refs.components);
          router.history.push(
            `/components/${Array.from(refs.components.keys())[0]}`
          );
        }
      }
    }
    electron.ipcRenderer.on("actions", listener);
    return () => {
      electron.ipcRenderer.removeListener("actions", listener);
    };
  }, [router]);

  function navigateToFirstComponentOrDefault(components: T.ComponentMap) {
    router.history.push(
      components.size > 0
        ? `/components/${firstKey(components)}`
        : `/typography`
    );
  }

  const onComponentChange = useCallback(
    (id: string, newComponent: T.Component) => {
      setComponents(components => set(components, id, newComponent));
      setIsSaved(false);
    },
    []
  );

  function createProject() {
    const project = makeDefaultProject();
    setColors(project.colors);
    setFontSizes(project.fontSizes);
    setFontWeights(project.fontWeights);
    setFontFamilies(project.fontFamilies);
    setBreakpoints(project.breakpoints);
    setComponents(project.components);
    navigateToFirstComponentOrDefault(project.components);
  }

  function menu() {
    return (
      <Menu
        components={components}
        onAddComponent={name => {
          const id = uuid();
          setComponents(set(components, id, { name, props: [] }));
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
        render={() => <Home onNewProjectClick={createProject} />}
      />
      <Route
        path="/typography"
        render={() => (
          <Typography
            menu={menu()}
            refs={refs}
            fontFamilies={fontFamilies}
            onFontFamiliesChange={fontFamilies => {
              setFontFamilies(fontFamilies);
              setIsSaved(false);
            }}
            fontSizes={fontSizes}
            onFontSizesChange={fontSizes => {
              setFontSizes(fontSizes);
              setIsSaved(false);
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
            colors={colors}
            onColorsChange={colors => {
              setColors(colors);
              setIsSaved(false);
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
            breakpoints={breakpoints}
            onBreakpointsChange={breakpoints => {
              setBreakpoints(breakpoints);
              setIsSaved(false);
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
                const newComponents = del(components, id);
                navigateToFirstComponentOrDefault(newComponents);
                setComponents(newComponents);
              }}
              refs={refs}
            />
          );
        }}
      />
    </React.Fragment>
  );
}

export default App;
