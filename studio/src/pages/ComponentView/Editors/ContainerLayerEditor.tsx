/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column } from "../../../styles";
import Select from "../../../components/Select";
import Field from "../../../components/Field";
import DimensionsEditor from "../../../pages/ComponentView/Editors/DimensionsEditor";
import ColorInput from "../../../components/ColorInput";

type Props = {
  layer: T.ContainerLayer;
  onChange: (layer: T.ContainerLayer) => void;
  refs: T.Refs;
};

function ContainerLayerEditor({ layer, onChange, refs }: Props) {
  function updateLayer(newProps: Partial<T.ContainerLayer>) {
    onChange({ ...layer, ...newProps });
  }

  return (
    <div css={[column]}>
      <h4>Layout</h4>
      <Field label="Direction">
        <Select
          options={[["row", "Row"], ["column", "Column"]]}
          value={layer.flexDirection}
          onChange={flexDirection => updateLayer({ flexDirection })}
        />
      </Field>
      <Field label="Background Color">
        <ColorInput
          value={layer.backgroundColor}
          colors={refs.colors}
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

export default ContainerLayerEditor;
