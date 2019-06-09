/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { useState } from "react";
import Input from "../../primitives/Input";
import AddModal from "../../components/AddModal";
import InputNumber from "../../primitives/InputNumber";

type Props = {
  items: T.FontSizesMap;
  onAdd: (name: string, item: T.FontSizeDefinition) => void;
  onCancel: () => void;
};

export default function AddFontSizeModal({ items, onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(16);
  const [isValidating, setIsValidating] = useState(false);

  function isNameValid() {
    return !items.has(name);
  }

  function isValueValid() {
    return true;
  }

  function isFormValid() {
    return isNameValid() && isValueValid();
  }

  return (
    <AddModal
      title="Add font size"
      onAdd={() => {
        if (!isFormValid()) {
          setIsValidating(true);
        } else {
          onAdd(name, { name, value: value + "px" });
        }
      }}
      onCancel={onCancel}
      form={
        <React.Fragment>
          <p
            css={{
              color: "rgb(102, 102, 102)",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px"
            }}
          >
            The name should unique.
          </p>
          <Input
            placeholder="Name"
            margin="0 0 12px"
            value={name}
            onChange={e => setName(e.target.value)}
            isInvalid={isValidating && !isNameValid()}
          />
          <InputNumber
            placeholder="Size in pixels"
            value={value}
            onChange={e => setValue(e.target.valueAsNumber)}
            isInvalid={isValidating && !isValueValid()}
          />
        </React.Fragment>
      }
    />
  );
}
