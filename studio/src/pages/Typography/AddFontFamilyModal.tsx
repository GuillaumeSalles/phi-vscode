/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import uuid from "uuid/v4";
import * as T from "../../types";
import { useState } from "react";
import Input from "../../components/Input";
import AddModal from "../../components/AddModal";

type Props = {
  fontFamilies: T.FontFamiliesMap;
  onAdd: (id: string, item: T.FontFamilyDefinition) => void;
  onCancel: () => void;
};

function AddFontFamilyModal({ fontFamilies, onAdd, onCancel }: Props) {
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
      title="Add font-family"
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
