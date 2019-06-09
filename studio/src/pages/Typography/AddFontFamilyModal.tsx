/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { row, column, heading } from "../../styles";
import { useState } from "react";
import Input from "../../primitives/Input";
import ModalButton from "../../primitives/ModalButton";

type Props = {
  fontFamilies: T.FontFamiliesMap;
  onAdd: (name: string, item: T.FontFamilyDefinition) => void;
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
    <div
      css={[
        column,
        {
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 20px 30px 0px;",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden"
        }
      ]}
    >
      <header
        css={[
          column,
          {
            padding: "30px 45px"
          }
        ]}
      >
        <h1 css={[heading, { alignSelf: "center" }]}>Add font-family</h1>
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
      </header>

      <div css={[row, { borderTop: "1px solid rgb(234, 234, 234)" }]}>
        <ModalButton text="cancel" onClick={() => onCancel()} />
        <ModalButton
          text="Add"
          onClick={() => {
            if (!isFormValid()) {
              setIsValidating(true);
            } else {
              onAdd(name, { name, value });
            }
          }}
        />
      </div>
    </div>
  );
}

export default AddFontFamilyModal;
