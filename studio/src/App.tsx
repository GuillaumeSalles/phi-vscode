/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "./types";
import { useState } from "react";
import { Route } from "react-router";
import { row, column } from "./styles";
import Menu from "./Menu";
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
    <div css={[row, { height: "100%", width: "100%" }]}>
      <div
        css={[
          column,
          {
            width: "240px",
            height: "100%",
            background: "white",
            flexShrink: 0
          }
        ]}
      >
        <Menu components={components} />
      </div>
      <div
        css={[
          {
            flex: "1 1 auto",
            height: "100%",
            background: "#f7f7f7",
            maxWidth: "calc(100% - 240px)"
          }
        ]}
      >
        <Route
          path="/typography"
          render={() => (
            <Typography
              fontFamilies={fontFamilies}
              onFontFamiliesChange={fontFamilies =>
                setFontFamilies(fontFamilies)
              }
              fontSizes={fontSizes}
              onFontSizesChange={fontSizes => setFontSizes(fontSizes)}
            />
          )}
        />
        <Route
          path="/colors"
          render={() => (
            <Colors
              colors={colors}
              onColorsChange={colors => setColors(colors)}
            />
          )}
        />
        <Route
          path="/breakpoints"
          render={() => (
            <Breakpoints
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
                component={component}
                onComponentChange={component => setComponent(component)}
                refs={refs}
              />
            );
          }}
        />
      </div>
    </div>
  );
}

export default App;
