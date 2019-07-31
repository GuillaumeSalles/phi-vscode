/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import Select from "./Select";
import { getContrastColor } from "../utils";
import { firstEntry } from "../helpers/immutable-map";

type Props = {
  value?: T.Color;
  colors: T.ColorsMap;
  onChange: (color: T.Color) => void;
};

function ColorInput({ value, colors, onChange }: Props) {
  if (value != null && value.type === "hex") {
    throw new Error("");
  }
  const colorId = value != null ? value.id : firstEntry(colors)[0];
  return (
    <Select
      value={colorId}
      options={Array.from(colors.entries()).map(entry => [
        entry[0],
        entry[1].name
      ])}
      onChange={value => onChange({ type: "ref", id: value })}
      backgroundColor={colors.get(colorId)!.value}
      color={getContrastColor(colors.get(colorId)!.value)}
    />
  );
}

export default ColorInput;
