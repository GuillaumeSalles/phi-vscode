/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import uuid from "uuid/v4";
import * as T from "../../types";
import Input from "../../components/Input";
import OkCancelModal from "../../components/OkCancelModal";
import { useStringFormEntry, useForm } from "../../components/Form";

type Props = {
  isOpen: boolean;
  fontFamilies: T.FontFamiliesMap;
  onAdd: (id: string, item: T.FontFamilyDefinition) => void;
  onCancel: () => void;
};

function AddFontFamilyModal({ isOpen, fontFamilies, onAdd, onCancel }: Props) {
  const nameEntry = useStringFormEntry("", value => {
    if (value.length === 0) {
      return "Font family name is required";
    }
  });
  const valueEntry = useStringFormEntry("", () => {
    return undefined;
  });
  const addFontFamily = useForm([nameEntry, valueEntry], () => {
    onAdd(uuid(), { name: nameEntry.value, value: valueEntry.value });
  });

  return (
    <OkCancelModal
      isOpen={isOpen}
      title="Add font-family"
      description="The name should unique."
      onOk={addFontFamily}
      onCancel={onCancel}
      form={
        <React.Fragment>
          <Input
            placeholder="Name"
            margin="0 0 12px"
            {...nameEntry.inputProps}
          />
          <Input
            placeholder="List of fonts separated by commas"
            {...valueEntry.inputProps}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddFontFamilyModal;
