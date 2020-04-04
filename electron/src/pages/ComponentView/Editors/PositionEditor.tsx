/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import {
  InnerPositionPropertyEditor,
  LengthPropertyEditor
} from "./StylePropertyEditor";
import AlignSelfEditor from "./AlignSelfEditor";
import { ArrowUp, ArrowDown, ArrowRight, ArrowLeft } from "../../../icons";
import SolidIconButton from "../../../components/SolidIconButton";

type Props = {
  style: T.LayerStyle;
  parentStyle: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
  applyAction: T.ApplyAction;
};

export default function PositionEditor({
  style,
  onChange,
  parentStyle,
  applyAction
}: Props) {
  return (
    <Section title="Positioning">
      <div css={{ padding: "4px" }}>
        <InnerPositionPropertyEditor style={style} onChange={onChange} />

        {style.position === "absolute" && (
          <div css={[row, { paddingTop: "8px" }]}>
            <LengthPropertyEditor
              label="Top"
              value={style.top}
              onChange={onChange}
              property="top"
              onlyPositive={false}
            />
            <LengthPropertyEditor
              label="Right"
              value={style.right}
              onChange={onChange}
              property="right"
              onlyPositive={false}
            />
            <LengthPropertyEditor
              label="Bottom"
              value={style.bottom}
              onChange={onChange}
              property="bottom"
              onlyPositive={false}
            />
            <LengthPropertyEditor
              label="Left"
              value={style.left}
              onChange={onChange}
              property="left"
              onlyPositive={false}
            />
          </div>
        )}
        {style.position !== "absolute" && parentStyle.display === "flex" && (
          <div
            css={[row, { justifyContent: "space-between", paddingTop: "12px" }]}
          >
            {(parentStyle.flexDirection === "row" ||
              parentStyle.flexDirection === "row-reverse") && (
              <div css={row}>
                <SolidIconButton
                  cssOverrides={{ marginRight: "8px" }}
                  onClick={() => {
                    applyAction({ type: "moveLayerUpOrDown", direction: "up" });
                  }}
                >
                  <ArrowLeft
                    height={16}
                    width={16}
                    cssOverrides={{ padding: "4px" }}
                  />
                </SolidIconButton>
                <SolidIconButton
                  onClick={() => {
                    applyAction({
                      type: "moveLayerUpOrDown",
                      direction: "down"
                    });
                  }}
                >
                  <ArrowRight
                    height={16}
                    width={16}
                    cssOverrides={{ padding: "4px" }}
                  />
                </SolidIconButton>
              </div>
            )}

            <AlignSelfEditor
              style={style}
              onChange={onChange}
              parentStyle={parentStyle}
            />

            {(parentStyle.flexDirection === "column" ||
              parentStyle.flexDirection === "column-reverse") && (
              <div css={row}>
                <SolidIconButton
                  cssOverrides={{ marginRight: "8px" }}
                  onClick={() => {
                    applyAction({ type: "moveLayerUpOrDown", direction: "up" });
                  }}
                >
                  <ArrowUp
                    height={16}
                    width={16}
                    cssOverrides={{ padding: "4px" }}
                  />
                </SolidIconButton>
                <SolidIconButton
                  onClick={() => {
                    applyAction({
                      type: "moveLayerUpOrDown",
                      direction: "down"
                    });
                  }}
                >
                  <ArrowDown
                    height={16}
                    width={16}
                    cssOverrides={{ padding: "4px" }}
                  />
                </SolidIconButton>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
