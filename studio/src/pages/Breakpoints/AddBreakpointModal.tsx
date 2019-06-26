/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import OkCancelModal from "../../components/OkCancelModal";
import uuid from "uuid/v4";
import { px } from "../../factories";
import {
  useForm,
  useStringFormEntry,
  useNumberFormEntry,
  FormInput,
  FormNumberInput
} from "../../components/Form";
import { valuesAsArray } from "../../helpers/immutable-map";

type Props = {
  isOpen: boolean;
  breakpoints: T.BreakpointsMap;
  onAdd: (name: string, newBp: T.BreakpointDefinition) => void;
  onCancel: () => void;
};

const variableNameRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9]*$");

function AddBreakpointsModal({ isOpen, breakpoints, onAdd, onCancel }: Props) {
  const nameEntry = useStringFormEntry("", value => {
    if (value.length === 0) {
      return "Breakpoint name is required";
    }
    if (!variableNameRegex.test(value)) {
      return "Breakpoint name should not start with number and should not contain any symbols";
    }
    if (valuesAsArray(breakpoints).some(b => b.name === value)) {
      return "Breakpoint name must be unique";
    }
  });
  const valueEntry = useNumberFormEntry(undefined, value => {
    if (value === undefined) {
      return "Breakpoint value is required";
    }
    if (value <= 0) {
      return "Breakpoint should be greater than 0px";
    }
  });
  const submit = useForm([nameEntry, valueEntry], () =>
    onAdd(uuid(), { name: nameEntry.value, value: px(valueEntry.value!) })
  );

  return (
    <OkCancelModal
      isOpen={isOpen}
      title="Create new breakpoint"
      onCancel={onCancel}
      onOk={submit}
      form={
        <React.Fragment>
          <FormInput
            placeholder="Name your breakpoint"
            {...nameEntry.inputProps}
          />
          <FormNumberInput
            placeholder="Enter breakpoint width in pixels."
            {...valueEntry.inputProps}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddBreakpointsModal;
