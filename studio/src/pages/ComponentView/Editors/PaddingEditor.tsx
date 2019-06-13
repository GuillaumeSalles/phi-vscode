/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row, column } from "../../../styles";
import Field from "../../../components/Field";
import LengthInput from "../../../components/LengthInput";

type Props = {
  padding: T.Padding;
  onChange: (padding: T.Padding) => void;
};

export default function PaddingEditor({ padding, onChange }: Props) {
  function updatePadding(newProps: Partial<T.Padding>) {
    onChange({ ...padding, ...newProps });
  }

  return (
    <div css={[column]}>
      <h4
        css={{
          margin: "8px",
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "1.3px",
          fontWeight: 400,
          color: "rgb(136,136,136)"
        }}
      >
        Padding
      </h4>
      <div css={row}>
        <Field label="Top">
          <LengthInput
            length={padding.paddingTop}
            defaultValue={0}
            onChange={paddingTop => updatePadding({ paddingTop })}
          />
        </Field>
        <Field label="Right">
          <LengthInput
            length={padding.paddingRight}
            defaultValue={0}
            onChange={paddingRight => updatePadding({ paddingRight })}
          />
        </Field>
        <Field label="Bottom">
          <LengthInput
            length={padding.paddingBottom}
            defaultValue={0}
            onChange={paddingBottom => updatePadding({ paddingBottom })}
          />
        </Field>
        <Field label="Left">
          <LengthInput
            length={padding.paddingLeft}
            defaultValue={0}
            onChange={paddingLeft => updatePadding({ paddingLeft })}
          />
        </Field>
      </div>
    </div>
  );
}
