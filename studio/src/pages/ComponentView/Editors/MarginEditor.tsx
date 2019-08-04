/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Field from "../../../components/Field";
import LengthInput from "../../../components/LengthInput";
import Section from "./Section";
import TextInput from "../../../components/TextInput";

type Props = {
  margin: T.Margin;
  onChange: (margin: T.Margin) => void;
};

export default function MarginEditor({ margin, onChange }: Props) {
  function updateMargin(newProps: Partial<T.Margin>) {
    onChange({ ...margin, ...newProps });
  }

  return (
    <Section title="Margin">
      <div css={row}>
        <Field label="Top">
          <TextInput
            value={margin.marginTop}
            onChange={marginTop =>
              updateMargin({
                marginTop
              })
            }
          />
        </Field>
        <Field label="Right">
          <TextInput
            value={margin.marginRight}
            onChange={marginRight =>
              updateMargin({
                marginRight
              })
            }
          />
        </Field>
        <Field label="Bottom">
          <TextInput
            value={margin.marginBottom}
            onChange={marginBottom =>
              updateMargin({
                marginBottom
              })
            }
          />
        </Field>
        <Field label="Left">
          <TextInput
            value={margin.marginLeft}
            onChange={marginLeft =>
              updateMargin({
                marginLeft
              })
            }
          />
        </Field>
      </div>
    </Section>
  );
}
