/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import Section from "./Section";
import { listToEntries } from "../../../utils";

type Props = {
  style: T.Display;
  onChange: (style: T.Display) => void;
};

const options = listToEntries(["flex", "block", "inline", "none"]);

export default function DisplayEditor({ style, onChange }: Props) {
  function updateStyle(newProps: Partial<T.Display>) {
    onChange({ ...style, ...newProps });
  }

  return (
    <Section title="Display">
      <div css={row}>
        <Field label="Display">
          <Select
            value={style.display}
            onChange={display => updateStyle({ display })}
            options={options}
          />
        </Field>
      </div>
    </Section>
  );
}
