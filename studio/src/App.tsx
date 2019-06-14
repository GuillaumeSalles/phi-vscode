/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "./types";
import { useState } from "react";
import { Route } from "react-router";
import {
  components as defaultComponents,
  colors as defaultColors,
  breakpoints as defaultBreakpoints,
  fontFamilies as defaultFontFamilies,
  fontSizes as defaultFontSizes,
  fontWeights,
  lineHeights
} from "./state";
import Colors from "./pages/Colors";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";

function App() {
  const [components, setComponents] = useState(defaultComponents);
  const [colors, setColors] = useState(defaultColors);
  const [fontFamilies, setFontFamilies] = useState(defaultFontFamilies);
  const [fontSizes, setFontSizes] = useState(defaultFontSizes);
  const [breakpoints, setBreakpoints] = useState(defaultBreakpoints);
  const refs: T.Refs = {
    colors,
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    breakpoints
  };

  function setComponent(newComponent: T.Component) {
    setComponents(
      components.map(c => (c.name === newComponent.name ? newComponent : c))
    );
  }

  return (
    <React.Fragment>
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
          const component = components.find(
            c => c.name === props.match.params.id
          );
          if (component == null) {
            throw new Error("Component not found");
          }
          return (
            <ComponentView
              components={components}
              component={component}
              onComponentChange={component => setComponent(component)}
              refs={refs}
            />
          );
        }}
      />
    </React.Fragment>
  );
}

export default App;
