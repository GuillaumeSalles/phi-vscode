/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import Select from "./Select";
import { getContrastColor } from "../utils";

type Props = {
  value?: T.Color;
  colors: T.ColorsMap;
  onChange: (color: T.Color | undefined) => void;
};

function ColorInput({ value, colors, onChange }: Props) {
  if (value != null && value.type === "hex") {
    throw new Error("");
  }
  const colorId = value != null ? value.id : "none";
  const options = ([["none", "none"]] as [string, string][]).concat(
    Array.from(colors.entries()).map(entry => [entry[0], entry[1].name])
  );
  const backgroundColor =
    value != null ? colors.get(colorId)!.value : undefined;
  const contrastColor =
    value != null ? getContrastColor(colors.get(colorId)!.value) : undefined;
  return (
    <Select
      value={colorId}
      options={options}
      onChange={value =>
        onChange(value === "none" ? undefined : { type: "ref", id: value })
      }
      backgroundColor={backgroundColor}
      color={contrastColor}
    />
  );
}

export default ColorInput;
