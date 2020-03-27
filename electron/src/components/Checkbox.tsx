/** @jsx jsx */
import { jsx } from "@emotion/core";
import { checkboxInputLabel } from "../styles";

type Props = {
  isChecked: boolean;
  onChange: ({ checked }: { checked: boolean }) => void;
  label: string;
  name: string;
  id: string;
};

export default function Checkbox({
  onChange,
  isChecked,
  name,
  id,
  label
}: Props) {
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        onChange={e =>
          onChange({
            checked: e.target.checked
          })
        }
      ></input>
      <label css={checkboxInputLabel} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
