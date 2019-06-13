/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, row, sectionTitle } from "../../../styles";
import Field from "../../../components/Field";
import DimensionsEditor from "./DimensionsEditor";
import Select from "../../../components/Select";
import ColorInput from "../../../components/ColorInput";
import NumberInput from "../../../components/NumberInput";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import TextAlignEditor from "./TextAlignEditor";

type Props = {
  layer: T.TextLayer;
  onChange: (layer: T.TextLayer) => void;
  refs: T.Refs;
};

const separator = {
  margin: "4px 0",
  border: "none",
  borderTop: "solid 1px #DDD"
};

function TextLayerEditor({ layer, onChange, refs }: Props) {
  function updateLayer(newProps: Partial<T.TextLayer>) {
    onChange({ ...layer, ...newProps });
  }

  return (
    <div css={column}>
      <div css={[column, { padding: "8px" }]}>
        <h4
          css={[
            sectionTitle,
            {
              margin: "8px"
            }
          ]}
        >
          Typography
        </h4>
        <div css={[row]}>
          <Field label="Font size">
            <Select
              value={layer.fontSize.id}
              onChange={value =>
                updateLayer({ fontSize: { type: "ref", id: value } })
              }
              options={Array.from(refs.fontSizes.entries()).map(entry => [
                entry[0],
                entry[0]
              ])}
            />
          </Field>
          <Field label="Color">
            <ColorInput
              colors={refs.colors}
              value={layer.color}
              onChange={value => updateLayer({ color: value })}
            />
          </Field>
        </div>
        <div css={row}>
          <Field label="Font family">
            <Select
              value={layer.fontFamily.id}
              onChange={value =>
                updateLayer({ fontFamily: { type: "ref", id: value } })
              }
              options={Array.from(refs.fontFamilies.entries()).map(entry => [
                entry[0],
                entry[0]
              ])}
            />
          </Field>
          <Field label="Font weight">
            <Select
              value={layer.fontWeight.id}
              onChange={value =>
                updateLayer({ fontWeight: { type: "ref", id: value } })
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
              value={layer.lineHeight ? layer.lineHeight.value : 0}
              onChange={value =>
                updateLayer({
                  lineHeight: value !== null ? { type: "px", value } : undefined
                })
              }
            />
          </Field>
          <Field label="Letter">
            <NumberInput
              step={0.5}
              value={layer.letterSpacing ? layer.letterSpacing.value : 0}
              onChange={value =>
                updateLayer({
                  letterSpacing:
                    value !== null ? { type: "px", value } : undefined
                })
              }
            />
          </Field>
        </div>
        <TextAlignEditor
          value={layer.textAlign}
          onChange={value => {
            const textAlign = value as T.TextAlignProperty;
            updateLayer({ textAlign: textAlign });
          }}
        />
      </div>
      {/* <Field label="Background Color" gridArea="3 0">
        <ColorInput
          colors={refs.colors}
          value={layer.backgroundColor}
          onChange={value => updateLayer({ backgroundColor: value })}
        />
      </Field> */}
      <hr css={separator} />
      <DimensionsEditor dimensions={layer} onChange={updateLayer} />
      <hr css={separator} />
      <MarginEditor margin={layer} onChange={updateLayer} />
      <PaddingEditor padding={layer} onChange={updateLayer} />
      <hr css={separator} />
    </div>
  );
}

export default TextLayerEditor;
