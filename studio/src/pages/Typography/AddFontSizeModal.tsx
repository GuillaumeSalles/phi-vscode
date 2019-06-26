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
import { validateFontSizeName } from "../../validators";

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
  const nameEntry = useStringFormEntry("", value =>
    validateFontSizeName(value, items)
  );
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
      onOk={addFontSize}
      onCancel={onCancel}
      form={
        <React.Fragment>
          <FormInput
            placeholder="Name your font size"
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
