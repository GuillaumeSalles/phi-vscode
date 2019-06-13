/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Field from "../../../components/Field";
import NumberInput from "../../../components/NumberInput";

type Props = {
  dimensions: T.Dimensions;
  onChange: (dimensions: T.Dimensions) => void;
};

function DimensionsEditor({ dimensions, onChange }: Props) {
  function updateDimensions(newProps: Partial<T.Dimensions>) {
    onChange({ ...dimensions, ...newProps });
  }

  return (
    <div css={[row]}>
      <Field label="Height">
        <NumberInput
          value={dimensions.height ? dimensions.height.value : null}
          onChange={value =>
            updateDimensions({
              height: value !== null ? { type: "px", value } : undefined
            })
          }
        />
      </Field>
      <Field label="Width">
        <NumberInput
          value={dimensions.width ? dimensions.width.value : null}
          onChange={value =>
            updateDimensions({
              width: value !== null ? { type: "px", value } : undefined
            })
          }
        />
      </Field>
    </div>
  );
}

export default DimensionsEditor;
