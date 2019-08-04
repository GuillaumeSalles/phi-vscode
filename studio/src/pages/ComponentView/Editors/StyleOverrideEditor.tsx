/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Section from "./Section";
import AddButton from "../../../components/AddButton";
import { useToggle } from "../../../hooks";
import { useRef } from "react";
import Popover from "../../../components/Popover";
import { card, row } from "../../../styles";
import { ColorEditor } from "./StylePropertyEditor";
import TextDecorationEditor from "./TextDecorationEditor";

const styleProperties: Array<keyof T.LayerStyle> = ["color", "textDecoration"];

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

  return (
    <div ref={popoverRef}>
      <Section
        title="Custom Style"
        topRightButton={
          <AddButton
            disabled={false}
            onClick={() => {
              popover.activate();
            }}
          />
        }
      >
        {Array.from(Object.entries(style)).map(entry => (
          <div key={entry[0]}>
            <PropertyEditor
              refs={refs}
              style={style}
              property={entry[0]}
              onChange={onChange}
            />
          </div>
        ))}
      </Section>
      <Popover
        anchor={popoverRef}
        isOpen={popover.isActive}
        onDismiss={popover.deactivate}
      >
        <div css={[card, { margin: "8px 0", width: "240px" }]}>
          {styleProperties.map(property => (
            <button
              key={property}
              onClick={() => {
                onChange({
                  ...style,
                  ...propToPartialStyle(property, rootStyle)
                });
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
  property: string;
  onChange: (style: T.LayerStyle) => void;
};

function propToPartialStyle(
  property: string,
  rootStyle: T.LayerStyle
): T.LayerStyle {
  return {
    [property]: rootStyle.textDecoration
  };
}

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
  }

  throw new Error(`Unknown property (${property})`);
}
