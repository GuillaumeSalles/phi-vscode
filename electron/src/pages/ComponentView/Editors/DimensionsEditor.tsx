/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { LengthPropertyEditor } from "./StylePropertyEditor";

type Props = {
  dimensions: T.Dimensions;
  onChange: (dimensions: T.Dimensions) => void;
};

function DimensionsEditor({ dimensions, onChange }: Props) {
  return (
    <Section title="Dimensions">
      <div css={[row]}>
        <LengthPropertyEditor
          label="Width"
          style={dimensions}
          onChange={onChange}
          property="width"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Min"
          style={dimensions}
          onChange={onChange}
          property="minWidth"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Max"
          style={dimensions}
          onChange={onChange}
          property="maxWidth"
          onlyPositive={true}
        />
      </div>

      <div css={[row]}>
        <LengthPropertyEditor
          label="Height"
          style={dimensions}
          onChange={onChange}
          property="height"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Min"
          style={dimensions}
          onChange={onChange}
          property="minHeight"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Max"
          style={dimensions}
          onChange={onChange}
          property="maxHeight"
          onlyPositive={true}
        />
      </div>
    </Section>
  );
}

export default DimensionsEditor;
