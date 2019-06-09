/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "./types";
import { column } from "./styles";
import Field from "./Field";
import DimensionsEditor from "./DimensionsEditor";
import Select from "./Select";
import ColorInput from "./ColorInput";
import NumberInput from "./NumberInput";

type Props = {
  layer: T.TextLayer;
  onChange: (layer: T.TextLayer) => void;
  refs: T.Refs;
};

function TextLayerEditor({ layer, onChange, refs }: Props) {
  function updateLayer(newProps: Partial<T.TextLayer>) {
    console.log(newProps);
    onChange({ ...layer, ...newProps });
  }

  return (
    <div css={[column]}>
      <Field label="Font size">
        <Select
          value={layer.fontSize.id}
          onChange={value =>
            updateLayer({ fontSize: { type: "ref", id: value } })
          }
          options={Array.from(refs.fontSizes.entries()).map(entry => [
            entry[0],
            entry[1].name
          ])}
        />
      </Field>
      <Field label="Font family">
        <Select
          value={layer.fontFamily.id}
          onChange={value =>
            updateLayer({ fontFamily: { type: "ref", id: value } })
          }
          options={Array.from(refs.fontFamilies.entries()).map(entry => [
            entry[0],
            entry[1].name
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
      <Field label="Line height">
        <Select
          value={layer.lineHeight.id}
          onChange={value =>
            updateLayer({ lineHeight: { type: "ref", id: value } })
          }
          options={Array.from(refs.lineHeights.entries()).map(entry => [
            entry[0],
            entry[1].name
          ])}
        />
      </Field>
      <Field label="Letter spacing">
        <NumberInput
          step={0.5}
          value={layer.letterSpacing ? layer.letterSpacing.value : null}
          onChange={value =>
            updateLayer({
              letterSpacing: value !== null ? { type: "px", value } : undefined
            })
          }
        />
      </Field>
      <Field label="Color">
        <ColorInput
          colors={refs.colors}
          value={layer.color}
          onChange={value => updateLayer({ color: value })}
        />
      </Field>
      <Field label="Background Color">
        <ColorInput
          colors={refs.colors}
          value={layer.backgroundColor}
          onChange={value => updateLayer({ backgroundColor: value })}
        />
      </Field>
      <DimensionsEditor
        dimensions={layer}
        onChange={dimensions => updateLayer(dimensions)}
      />
    </div>
  );
}

export default TextLayerEditor;
