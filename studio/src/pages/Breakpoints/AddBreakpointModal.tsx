/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import Input from "../../components/Input";
import InputNumber from "../../components/InputNumber";
import OkCancelModal from "../../components/OkCancelModal";
import uuid from "uuid/v4";
import { px } from "../../factories";
import {
  useForm,
  useStringFormEntry,
  useNumberFormEntry
} from "../../components/Form";

type Props = {
  isOpen: boolean;
  breakpoints: T.BreakpointsMap;
  onAdd: (name: string, newBp: T.BreakpointDefinition) => void;
  onCancel: () => void;
};

function AddBreakpointsModal({ isOpen, breakpoints, onAdd, onCancel }: Props) {
  const nameEntry = useStringFormEntry("", value => {
    if (value.length === 0) {
      return "Breakpoint name is required";
    }
    if (Array.from(breakpoints.values()).some(b => b.name === value)) {
      return "Breakpoint name must be unique";
    }
  });
  const valueEntry = useNumberFormEntry(600, value => {
    if (value <= 0) {
      return "Breakpoint should be greater than 0px";
    }
  });
  const submit = useForm([nameEntry, valueEntry], () =>
    onAdd(uuid(), { name: nameEntry.value, value: px(valueEntry.value) })
  );

  return (
    <OkCancelModal
      isOpen={isOpen}
      title="Add breakpoint"
      description="The name should unique."
      onCancel={onCancel}
      onOk={submit}
      form={
        <React.Fragment>
          <Input
            placeholder="Name"
            margin="0 0 12px"
            {...nameEntry.inputProps}
          />
          <InputNumber
            margin="0 0 12px"
            placeholder="Value in pixels."
            {...valueEntry.inputProps}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddBreakpointsModal;
