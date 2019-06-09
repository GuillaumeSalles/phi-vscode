/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { useState } from "react";
import Input from "../../primitives/Input";
import InputNumber from "../../primitives/InputNumber";
import AddModal from "../../components/AddModal";

type Props = {
  breakpoints: T.BreakpointsMap;
  onAdd: (name: string, newBp: T.BreakpointDefinition) => void;
  onCancel: () => void;
};

function AddBreakpointsModal({ breakpoints, onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(600);
  const [isValidating, setIsValidating] = useState(false);

  function isNameValid() {
    return !breakpoints.has(name);
  }

  function isValueValid() {
    return true;
  }

  function isFormValid() {
    return isNameValid() && isValueValid();
  }

  return (
    <AddModal
      title="Add breakpoint"
      onCancel={onCancel}
      onAdd={() => {
        if (!isFormValid()) {
          setIsValidating(true);
        } else {
          onAdd(name, { value, type: "px" });
        }
      }}
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
            placeholder="Value in pixels."
            value={value}
            onChange={e => setValue(e.target.valueAsNumber)}
            isInvalid={isValidating && !isValueValid()}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddBreakpointsModal;
