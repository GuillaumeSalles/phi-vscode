/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import OkCancelModal from "../../components/OkCancelModal";
import uuid from "uuid/v4";
import {
  useStringFormEntry,
  useNumberFormEntry,
  useForm,
  FormInput,
  FormNumberInput
} from "../../components/Form";

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
  const nameEntry = useStringFormEntry("", value => {
    if (value.length === 0) {
      return "Font size name is required";
    }
  });
  const valueEntry = useNumberFormEntry(16, () => {
    return undefined;
  });
  const addFontSize = useForm([nameEntry, valueEntry], () => {
    onAdd(uuid(), { name: nameEntry.value, value: valueEntry.value + "px" });
  });

  return (
    <OkCancelModal
      isOpen={isOpen}
      title="Add font size"
      description="The name should unique."
      onOk={addFontSize}
      onCancel={onCancel}
      form={
        <React.Fragment>
          <FormInput
            placeholder="Name"
            margin="0 0 12px"
            {...nameEntry.inputProps}
          />
          <FormNumberInput
            placeholder="Size in pixels"
            {...valueEntry.inputProps}
          />
        </React.Fragment>
      }
    />
  );
}
