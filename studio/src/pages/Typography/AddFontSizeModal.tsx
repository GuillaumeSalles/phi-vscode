/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { useState } from "react";
import Input from "../../components/Input";
import AddModal from "../../components/AddModal";
import InputNumber from "../../components/InputNumber";
import uuid from "uuid/v4";

type Props = {
  isOpen: boolean;
  items: T.FontSizesMap;
  onAdd: (name: string, item: T.FontSizeDefinition) => void;
  onCancel: () => void;
};

export default function AddFontSizeModal({
  isOpen,
  items,
  onAdd,
  onCancel
}: Props) {
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
      isOpen={isOpen}
      title="Add font size"
      description="The name should unique."
      onAdd={() => {
        if (!isFormValid()) {
          setIsValidating(true);
        } else {
          onAdd(uuid(), { name, value: value + "px" });
        }
      }}
      onCancel={onCancel}
      form={
        <React.Fragment>
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
