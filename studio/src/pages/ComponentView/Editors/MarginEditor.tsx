/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row, column, sectionTitle } from "../../../styles";
import Field from "../../../components/Field";
import LengthInput from "../../../components/LengthInput";

type Props = {
  margin: T.Margin;
  onChange: (margin: T.Margin) => void;
};

export default function MarginEditor({ margin, onChange }: Props) {
  function updateMargin(newProps: Partial<T.Margin>) {
    onChange({ ...margin, ...newProps });
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
        Margin
      </h4>
      <div css={row}>
        <Field label="Top">
          <LengthInput
            length={margin.marginTop}
            defaultValue={0}
            onChange={marginTop => updateMargin({ marginTop })}
          />
        </Field>
        <Field label="Right">
          <LengthInput
            length={margin.marginRight}
            defaultValue={0}
            onChange={marginRight => updateMargin({ marginRight })}
          />
        </Field>
        <Field label="Bottom">
          <LengthInput
            length={margin.marginBottom}
            defaultValue={0}
            onChange={marginBottom => updateMargin({ marginBottom })}
          />
        </Field>
        <Field label="Left">
          <LengthInput
            length={margin.marginLeft}
            defaultValue={0}
            onChange={marginLeft => updateMargin({ marginLeft })}
          />
        </Field>
      </div>
    </div>
  );
}
