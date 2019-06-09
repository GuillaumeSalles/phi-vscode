/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props<TValue extends string> = {
  value: TValue;
  options: Array<[TValue, string]>;
  onChange: (value: TValue) => void;
};

function Select<TValue extends string>({
  value,
  onChange,
  options
}: Props<TValue>) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as TValue)}>
      {options.map(option => (
        <option key={option[0]} value={option[0]}>
          {option[1]}
        </option>
      ))}
    </select>
  );
}

export default Select;
