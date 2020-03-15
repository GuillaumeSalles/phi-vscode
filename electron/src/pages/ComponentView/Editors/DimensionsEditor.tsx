/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { SimpleTextPropertyEditor } from "./StylePropertyEditor";

type Props = {
  dimensions: T.Dimensions;
  onChange: (dimensions: T.Dimensions) => void;
};

function DimensionsEditor({ dimensions, onChange }: Props) {
  return (
    <Section title="Dimensions">
      <div css={[row]}>
        <SimpleTextPropertyEditor
          label="Width"
          style={dimensions}
          onChange={onChange}
          property="width"
        />
        <SimpleTextPropertyEditor
          label="Min"
          style={dimensions}
          onChange={onChange}
          property="minWidth"
        />
        <SimpleTextPropertyEditor
          label="Max"
          style={dimensions}
          onChange={onChange}
          property="maxWidth"
        />
      </div>

      <div css={[row]}>
        <SimpleTextPropertyEditor
          label="Height"
          style={dimensions}
          onChange={onChange}
          property="height"
        />
        <SimpleTextPropertyEditor
          label="Min"
          style={dimensions}
          onChange={onChange}
          property="minHeight"
        />
        <SimpleTextPropertyEditor
          label="Max"
          style={dimensions}
          onChange={onChange}
          property="maxHeight"
        />
      </div>
    </Section>
  );
}

export default DimensionsEditor;
