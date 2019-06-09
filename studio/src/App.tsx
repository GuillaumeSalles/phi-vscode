/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row, column } from "./styles";
import Menu from "./Menu";
import {
  components as defaultComponents,
  refs,
  colors as defaultColors
} from "./state";
import LayersTree from "./LayersTree";
import { useState } from "react";
import Colors from "./pages/Colors";
import { Route } from "react-router";
import Typography from "./pages/Typography";
import Breakpoints from "./pages/Breakpoints";
import ComponentView from "./pages/ComponentView";

function App() {
  const [components, setComponents] = useState(defaultComponents);
  const [colors, setColors] = useState(defaultColors);
  const [selectedComponent, setComponent] = useState(components[0]);
  const [selectedLayer, setLayer] = useState(selectedComponent.layout);
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
      <div css={[{ flex: "1 1 auto", height: "100%", background: "#fafafa" }]}>
        <Route path="/typography" component={Typography} />
        <Route
          path="/colors"
          render={() => (
            <Colors
              colors={colors}
              onColorsChange={colors => setColors(colors)}
            />
          )}
        />
        <Route path="/breakpoints" component={Breakpoints} />
        <Route
          path="/components/:id"
          render={props => {
            const component = components.find(
              c => c.name === props.match.params.id
            );
            if (component == null) {
              throw new Error("Component not found");
            }
            return <ComponentView component={component} refs={refs} />;
          }}
        />
      </div>
    </div>
  );
}

export default App;
