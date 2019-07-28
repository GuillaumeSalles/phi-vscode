/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import TextAlignEditor from "./TextAlignEditor";
import TextDecorationEditor from "./TextDecorationEditor";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import ColorInput from "../../../components/ColorInput";
import NumberInput from "../../../components/NumberInput";
import Section from "./Section";

type Props = {
  style: T.TextLayerStyle;
  onChange: (style: T.TextLayerStyle) => void;
  refs: T.Refs;
};

export default function TypographyEditor({ style, onChange, refs }: Props) {
  function updateLayerStyle(newProps: Partial<T.TextLayerStyle>) {
    onChange({ ...style, ...newProps });
  }

  return (
    <Section title="Typography">
      <div css={[row]}>
        <Field label="Font size">
          <Select
            value={style.fontSize.id}
            onChange={value =>
              updateLayerStyle({ fontSize: { type: "ref", id: value } })
            }
            options={Array.from(refs.fontSizes.entries()).map(entry => [
              entry[0],
              entry[1].name
            ])}
          />
        </Field>
        <Field label="Color">
          <ColorInput
            colors={refs.colors}
            value={style.color}
            onChange={value => updateLayerStyle({ color: value })}
          />
        </Field>
      </div>
      <div css={row}>
        <Field label="Font family">
          <Select
            value={style.fontFamily.id}
            onChange={value =>
              updateLayerStyle({ fontFamily: { type: "ref", id: value } })
            }
            options={Array.from(refs.fontFamilies.entries()).map(entry => [
              entry[0],
              entry[1].name
            ])}
          />
        </Field>
        <Field label="Font weight">
          <Select
            value={style.fontWeight.id}
            onChange={value =>
              updateLayerStyle({ fontWeight: { type: "ref", id: value } })
            }
            options={Array.from(refs.fontWeights.entries()).map(entry => [
              entry[0],
              entry[1].name
            ])}
          />
        </Field>
      </div>
      <div css={row}>
        <Field label="Line">
          <NumberInput
            value={style.lineHeight}
            onChange={lineHeight =>
              updateLayerStyle({
                lineHeight: lineHeight === null ? 1.2 : lineHeight
              })
            }
          />
        </Field>
        <Field label="Letter">
          <NumberInput
            step={0.5}
            value={style.letterSpacing ? style.letterSpacing.value : 0}
            onChange={value =>
              updateLayerStyle({
                letterSpacing:
                  value !== null ? { type: "px", value } : undefined
              })
            }
          />
        </Field>
      </div>
      <div css={[row, { padding: "0 8px" }]}>
        <TextAlignEditor
          value={style.textAlign}
          onChange={textAlign => updateLayerStyle({ textAlign })}
        />
        <TextDecorationEditor
          value={style}
          onChange={style => updateLayerStyle({ ...style })}
        />
      </div>
    </Section>
  );
}
