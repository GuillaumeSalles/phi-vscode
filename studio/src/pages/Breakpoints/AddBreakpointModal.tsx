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
import {
  validateBreakpointName,
  validateBreakpointValue
} from "../../validators";

type Props = {
  isOpen: boolean;
  breakpoints: T.BreakpointsMap;
  onAdd: (name: string, newBp: T.BreakpointDefinition) => void;
  onCancel: () => void;
};

function AddBreakpointsModal({ isOpen, breakpoints, onAdd, onCancel }: Props) {
  const nameEntry = useStringFormEntry("", value =>
    validateBreakpointName(value, breakpoints)
  );
  const valueEntry = useNumberFormEntry(undefined, value =>
    validateBreakpointValue(value)
  );
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
            placeholder="Enter breakpoint width in pixels"
            {...valueEntry.inputProps}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddBreakpointsModal;
