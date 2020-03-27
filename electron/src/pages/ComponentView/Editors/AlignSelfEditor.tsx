/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../../types";
import RadioIconGroup from "../../../components/RadioIconGroup";
import {
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignStretch,
  AlignTop,
  AlignBottom,
  AlignVerticalCenter,
  AlignVerticalStretch
} from "../../../icons";
import { row } from "../../../styles";

type Props = {
  style: T.LayerStyle;
  parentStyle: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
};

function alignSelfOptions(
  flexDirection?: T.FlexDirection
): Array<[T.AlignSelfProperty, () => React.ReactNode]> {
  switch (flexDirection) {
    case "column":
    case "column-reverse":
      return [
        ["flex-start", () => <AlignLeft height={16} width={16} />],
        ["center", () => <AlignCenter height={16} width={16} />],
        ["flex-end", () => <AlignRight height={16} width={16} />],
        ["stretch", () => <AlignStretch height={16} width={16} />]
      ];
    case undefined:
    case "row":
    case "row-reverse":
      return [
        ["flex-start", () => <AlignTop height={16} width={16} />],
        ["center", () => <AlignVerticalCenter height={16} width={16} />],
        ["flex-end", () => <AlignBottom height={16} width={16} />],
        ["stretch", () => <AlignVerticalStretch height={16} width={16} />]
      ];
  }
}

export default function AlignSelfEditor({
  style,
  onChange,
  parentStyle
}: Props) {
  if (parentStyle.display !== "flex") {
    return null;
  }

  return (
    <div css={[row]}>
      <RadioIconGroup
        name="text-align"
        options={alignSelfOptions(parentStyle.flexDirection)}
        value={style.alignSelf}
        onChange={alignSelf => onChange({ alignSelf })}
      />
    </div>
  );
}
