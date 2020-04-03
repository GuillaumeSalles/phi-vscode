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
  onChange: (style: Partial<T.Display>) => void;
  allowedDisplays: T.DisplayProperty[];
};

export default function LayerDisplayEditor({
  style,
  onChange,
  allowedDisplays
}: Props) {
  return (
    <Section title="Layout">
      <div css={[row, { flexWrap: "wrap" }]}>
        <DisplayEditor
          style={style}
          onChange={onChange}
          allowedDisplays={allowedDisplays}
        />
        {style.display === "flex" && (
          <React.Fragment>
            <FlexDirectionEditor
              value={style.flexDirection}
              onChange={onChange}
            />
            <FlexWrapEditor value={style.flexWrap} onChange={onChange} />
            <JustifyContentEditor
              value={style.justifyContent}
              onChange={onChange}
            />
            <AlignItemsEditor value={style.alignItems} onChange={onChange} />
            <AlignContentEditor
              value={style.alignContent}
              onChange={onChange}
            />
          </React.Fragment>
        )}
      </div>
    </Section>
  );
}
