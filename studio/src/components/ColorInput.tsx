/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import Select from "./Select";
import { getContrastColor } from "../utils";

type Props = {
  value?: T.Color;
  colors: T.ColorsMap;
  onChange: (color: T.Color) => void;
};

function ColorInput({ value, colors, onChange }: Props) {
  if (value === undefined || value.type === "hex") {
    throw new Error("");
  }
  return (
    <Select
      value={value.id}
      options={Array.from(colors.entries()).map(entry => [
        entry[0],
        entry[1].name
      ])}
      onChange={value => onChange({ type: "ref", id: value })}
      backgroundColor={colors.get(value.id)!.value}
      color={getContrastColor(colors.get(value.id)!.value)}
    />
  );
}

export default ColorInput;
