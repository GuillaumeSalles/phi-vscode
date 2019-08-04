/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Section from "./Section";
import AddButton from "../../../components/AddButton";
import { useToggle } from "../../../hooks";
import { useRef } from "react";
import Popover from "../../../components/Popover";
import { card, row, column, sectionTitle, colors } from "../../../styles";
import {
  ColorEditor,
  FontSizeEditor,
  FontFamilyEditor,
  LetterSpacingEditor,
  LineHeightEditor,
  FontWeightEditor,
  DisplayEditor,
  FlexDirectionEditor,
  FlexWrapEditor,
  JustifyContentEditor,
  AlignItemsEditor,
  AlignContentEditor
} from "./StylePropertyEditor";
import TextDecorationEditor from "./TextDecorationEditor";
import IconButton from "../../../components/IconButton";
import { Delete } from "../../../icons";
import { assertUnreachable } from "../../../utils";
import TextAlignEditor from "./TextAlignEditor";

const styleProperties: Array<keyof T.LayerStyle> = [
  "color",
  "textDecoration",
  "fontSize",
  "fontFamily",
  "letterSpacing",
  "lineHeight",
  "fontWeight",
  "textAlign",
  "display",
  "flexDirection",
  "flexWrap",
  "alignContent",
  "alignItems",
  "justifyContent"
];

type Props = {
  rootStyle: T.LayerStyle;
  refs: T.Refs;
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
};

export default function StyleOverrideEditor({
  rootStyle,
  style,
  onChange,
  refs
}: Props) {
  const popover = useToggle(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const propertiesToAdd = styleProperties.filter(
    prop => !style.hasOwnProperty(prop)
  );

  function updateStyle(partialStyle: T.LayerStyle) {
    onChange({
      ...style,
      ...partialStyle
    });
  }

  return (
    <div ref={popoverRef}>
      <div css={[column, { padding: "8px" }]}>
        <div
          css={[
            row,
            {
              margin: "0 8px",
              justifyContent: "space-between"
            }
          ]}
        >
          <h4 css={[sectionTitle]}>CSS</h4>
          <AddButton
            disabled={propertiesToAdd.length === 0}
            onClick={() => {
              popover.activate();
            }}
          />
        </div>

        {Array.from(Object.entries(style)).map(entry => (
          <div
            key={entry[0]}
            css={[
              row,
              {
                flex: "1 1 auto",
                alignItems: "center",
                marginRight: "4px",
                ":hover button": {
                  display: "block"
                }
              }
            ]}
          >
            <div css={{ flex: "1 1 auto" }}>
              <PropertyEditor
                refs={refs}
                style={style}
                property={entry[0] as keyof T.LayerStyle}
                onChange={updateStyle}
              />
            </div>

            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Delete height={20} width={20} />}
              onClick={e => {
                const {
                  [entry[0] as keyof T.LayerStyle]: value,
                  ...withoutProp
                } = style;
                onChange(withoutProp);
              }}
            />
          </div>
        ))}
      </div>
      <Popover
        anchor={popoverRef}
        isOpen={popover.isActive}
        onDismiss={popover.deactivate}
      >
        <div css={[card, { margin: "8px 0", width: "240px" }]}>
          {propertiesToAdd.map(property => (
            <button
              key={property}
              onClick={() => {
                const newStyle = {
                  ...style,
                  [property]: rootStyle[property]
                };
                console.log(newStyle);
                onChange(newStyle);
              }}
              css={[
                row,
                {
                  alignItems: "center",
                  padding: "8px 16px",
                  border: "none",
                  width: "100%",
                  fontSize: "14px",
                  ":hover": {
                    backgroundColor: "#EAEAEA"
                  }
                }
              ]}
            >
              <span css={{ marginLeft: "8px" }}>{property}</span>
            </button>
          ))}
        </div>
      </Popover>
    </div>
  );
}

type PropertyEditorProps = {
  refs: T.Refs;
  style: T.LayerStyle;
  property: keyof T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
};

function PropertyEditor({
  refs,
  style,
  property,
  onChange
}: PropertyEditorProps) {
  switch (property) {
    case "color":
      return <ColorEditor refs={refs} style={style} onChange={onChange} />;
    case "textDecoration":
      return <TextDecorationEditor style={style} onChange={onChange} />;
    case "fontSize":
      return <FontSizeEditor style={style} onChange={onChange} refs={refs} />;
    case "fontFamily":
      return <FontFamilyEditor style={style} onChange={onChange} refs={refs} />;
    case "letterSpacing":
      return <LetterSpacingEditor style={style} onChange={onChange} />;
    case "lineHeight":
      return <LineHeightEditor style={style} onChange={onChange} />;
    case "textAlign":
      return <TextAlignEditor style={style} onChange={onChange} />;
    case "fontWeight":
      return <FontWeightEditor style={style} onChange={onChange} refs={refs} />;
    case "display":
      return (
        <DisplayEditor
          style={style}
          onChange={onChange}
          allowedDisplays={["flex", "block", "inline", "none"]}
        />
      );
    case "flexDirection":
      return <FlexDirectionEditor style={style} onChange={onChange} />;
    case "flexWrap":
      return <FlexWrapEditor style={style} onChange={onChange} />;
    case "justifyContent":
      return <JustifyContentEditor style={style} onChange={onChange} />;
    case "alignItems":
      return <AlignItemsEditor style={style} onChange={onChange} />;
    case "alignContent":
      return <AlignContentEditor style={style} onChange={onChange} />;
    case "backgroundColor":
    case "height":
    case "minHeight":
    case "maxHeight":
    case "width":
    case "minWidth":
    case "maxWidth":
    case "marginTop":
    case "marginRight":
    case "marginBottom":
    case "marginLeft":
    case "paddingTop":
    case "paddingRight":
    case "paddingBottom":
    case "paddingLeft":
    case "overrides":
      throw new Error("TODO");
  }

  assertUnreachable(property);
}
