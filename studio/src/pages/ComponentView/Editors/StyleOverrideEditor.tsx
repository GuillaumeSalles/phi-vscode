/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Section from "./Section";
import AddButton from "../../../components/AddButton";
import { useToggle } from "../../../hooks";
import { useRef } from "react";
import Popover from "../../../components/Popover";
import { card, row } from "../../../styles";
import Field from "../../../components/Field";
import ColorInput from "../../../components/ColorInput";
import { firstKey } from "../../../helpers/immutable-map";
import { makeRef } from "../../../factories";

type Props = {
  refs: T.Refs;
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
};

export default function StyleOverrideEditor({ style, onChange, refs }: Props) {
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
          {["color"].map(property => (
            <button
              key={property}
              onClick={() => {
                onChange({ ...style, color: makeRef(firstKey(refs.colors)) });
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

function PropertyEditor({
  refs,
  style,
  property,
  onChange
}: PropertyEditorProps) {
  switch (property) {
    case "color":
      return (
        <Field label="Color">
          <ColorInput
            colors={refs.colors}
            value={style.color}
            onChange={value => onChange({ color: value })}
          />
        </Field>
      );
  }

  throw new Error("Unknown property");
}
