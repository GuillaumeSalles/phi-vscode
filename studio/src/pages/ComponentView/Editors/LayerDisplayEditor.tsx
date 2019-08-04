/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import {
  DisplayEditor,
  FlexDirectionEditor,
  FlexWrapEditor,
  JustifyContentEditor,
  AlignItemsEditor,
  AlignContentEditor
} from "./StylePropertyEditor";

type Props = {
  style: T.Display;
  onChange: (style: T.Display) => void;
  allowedDisplays: T.DisplayProperty[];
};

export default function LayerDisplayEditor({
  style,
  onChange,
  allowedDisplays
}: Props) {
  function updateStyle(newProps: Partial<T.Display>) {
    onChange({ ...style, ...newProps });
  }

  return (
    <Section title="Layout">
      <div css={[row, { flexWrap: "wrap" }]}>
        <DisplayEditor
          style={style}
          onChange={updateStyle}
          allowedDisplays={allowedDisplays}
        />
        {style.display === "flex" && (
          <React.Fragment>
            <FlexDirectionEditor style={style} onChange={updateStyle} />
            <FlexWrapEditor style={style} onChange={updateStyle} />
            <JustifyContentEditor style={style} onChange={updateStyle} />
            <AlignItemsEditor style={style} onChange={updateStyle} />
            <AlignContentEditor style={style} onChange={updateStyle} />
          </React.Fragment>
        )}
      </div>
    </Section>
  );
}
