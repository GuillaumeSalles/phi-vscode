/** @jsx jsx */
import { jsx } from "@emotion/core";
import { colors } from "../styles";
import React from "react";

function RadioIconInput<TValue extends string>({
  icon,
  value,
  isSelected,
  name,
  onChange
}: {
  icon: (props: { isSelected: boolean }) => React.ReactNode;
  value: TValue;
  isSelected: boolean;
  name: string;
  onChange: (value: TValue) => void;
}) {
  return (
    <label
      css={{
        padding: "4px 8px",
        display: "flex",
        background: isSelected ? colors.primary : "#F0F0F0"
      }}
    >
      <input
        css={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0
        }}
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={e => onChange(e.target.value as TValue)}
      />
      {icon({ isSelected })}
    </label>
  );
}

type Props<TValue extends string> = {
  value: TValue;
  onChange: (value: TValue) => void;
  name: string;
  options: [TValue, (props: { isSelected: boolean }) => React.ReactNode][];
};

export default function RadioIconGroup<TValue extends string>({
  options,
  name,
  value,
  onChange
}: Props<TValue>) {
  return (
    <React.Fragment>
      {options.map(option => (
        <RadioIconInput
          key={option[0]}
          value={option[0]}
          name={name}
          isSelected={value === option[0]}
          icon={option[1]}
          onChange={onChange}
        />
      ))}
    </React.Fragment>
  );
}
