/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import uuid from "uuid/v4";
import * as T from "../../types";
import { useState } from "react";
import Input from "../../components/Input";
import AddModal from "../../components/AddModal";

type Props = {
  isOpen: boolean;
  fontFamilies: T.FontFamiliesMap;
  onAdd: (id: string, item: T.FontFamilyDefinition) => void;
  onCancel: () => void;
};

function AddFontFamilyModal({ isOpen, fontFamilies, onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  function isNameValid() {
    return !fontFamilies.has(name);
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
      title="Add font-family"
      description="The name should unique."
      onAdd={() => {
        if (!isFormValid()) {
          setIsValidating(true);
        } else {
          onAdd(uuid(), { name, value });
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
          <Input
            placeholder="List of fonts separated by commas"
            value={value}
            onChange={e => setValue(e.target.value)}
            isInvalid={isValidating && !isValueValid()}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddFontFamilyModal;
