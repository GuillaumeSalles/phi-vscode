/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row, column, sectionTitle } from "../../../styles";
import Field from "../../../components/Field";
import NumberInput from "../../../components/NumberInput";
import TextInput from "../../../TextInput";

type Props = {
  dimensions: T.Dimensions;
  onChange: (dimensions: T.Dimensions) => void;
};

function DimensionsEditor({ dimensions, onChange }: Props) {
  function updateDimensions(newProps: Partial<T.Dimensions>) {
    onChange({ ...dimensions, ...newProps });
  }

  return (
    <div css={[column, { padding: "0 8px" }]}>
      <h4
        css={[
          sectionTitle,
          {
            margin: "8px"
          }
        ]}
      >
        Dimensions
      </h4>
      <div css={[row]}>
        <Field label="Width">
          <TextInput
            value={dimensions.width}
            onChange={width =>
              updateDimensions({
                width
              })
            }
          />
        </Field>
        <Field label="Min">
          <TextInput
            value={dimensions.minWidth}
            onChange={minWidth =>
              updateDimensions({
                minWidth
              })
            }
          />
        </Field>
        <Field label="Max">
          <TextInput
            value={dimensions.maxWidth}
            onChange={maxWidth =>
              updateDimensions({
                maxWidth
              })
            }
          />
        </Field>
      </div>

      <div css={[row]}>
        <Field label="Height">
          <TextInput
            value={dimensions.height}
            onChange={height =>
              updateDimensions({
                height
              })
            }
          />
        </Field>
        <Field label="Min">
          <TextInput
            value={dimensions.minHeight}
            onChange={minHeight =>
              updateDimensions({
                minHeight
              })
            }
          />
        </Field>
        <Field label="Max">
          <TextInput
            value={dimensions.maxHeight}
            onChange={maxHeight =>
              updateDimensions({
                maxHeight
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

export default DimensionsEditor;
