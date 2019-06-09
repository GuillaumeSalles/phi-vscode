/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "./types";
import Autocomplete from "react-autocomplete";
import { row } from "./styles";

type Props = {
  value?: T.Color;
  colors: T.ColorsMap;
  onChange: (color: T.Color) => void;
};

function colorToValue(color?: T.Color) {
  if (color == null) {
    return "";
  }
  switch (color.type) {
    case "ref":
      return color.id;
    case "hex":
      return color.value;
    default:
      throw new Error("Invalid color type");
  }
}

function colorToCss(color: T.Color | undefined, colors: T.ColorsMap) {
  if (color == null) {
    return "";
  }
  switch (color.type) {
    case "ref":
      return colors.get(color.id)!.value;
    case "hex":
      return color.value;
    default:
      throw new Error("Invalid color type");
  }
}

function ColorInput({ value, colors, onChange }: Props) {
  return (
    <Autocomplete
      getItemValue={(entry: [string, T.ColorDefinition]) => entry[0]}
      items={Array.from(colors.entries())}
      renderInput={props => (
        <div css={{ position: "relative" }}>
          <input
            {...props}
            css={{ width: "100%", boxSizing: "border-box", height: "24px" }}
          />
          <div
            css={{
              position: "absolute",
              background: colorToCss(value, colors),
              height: "20px",
              width: "20px",
              right: "4px",
              top: "2px",
              bottom: "2px"
            }}
          />
        </div>
      )}
      renderItem={(
        item: [string, T.ColorDefinition],
        isHighlighted: boolean
      ) => (
        <div
          key={item[0]}
          css={[
            row,
            {
              alignItems: "center",
              padding: "2px 4px",
              background: isHighlighted ? "lightgray" : "white"
            }
          ]}
        >
          <div css={{ flex: "1 1 auto" }}>{item[1].name}</div>
          <div
            css={{
              flex: "0 0 auto",
              background: item[1].value,
              height: "20px",
              width: "20px"
            }}
          />
        </div>
      )}
      value={colorToValue(value)}
      onSelect={(value: string) => onChange({ type: "ref", id: value })}
      onChange={e => {
        const refColor = colors.get(e.target.value);
        if (refColor) {
          onChange({ type: "ref", id: e.target.value });
        } else {
          onChange({ type: "hex", value: e.target.value });
        }
      }}
    />
  );
}

export default ColorInput;
