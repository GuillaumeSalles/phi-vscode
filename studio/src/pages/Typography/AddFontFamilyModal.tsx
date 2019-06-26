/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import uuid from "uuid/v4";
import * as T from "../../types";
import OkCancelModal from "../../components/OkCancelModal";
import { useStringFormEntry, useForm, FormInput } from "../../components/Form";
import { validateFontFamilyName } from "../../validators";

type Props = {
  isOpen: boolean;
  fontFamilies: T.FontFamiliesMap;
  onAdd: (id: string, item: T.FontFamilyDefinition) => void;
  onCancel: () => void;
};

function AddFontFamilyModal({ isOpen, fontFamilies, onAdd, onCancel }: Props) {
  const nameEntry = useStringFormEntry("", value =>
    validateFontFamilyName(value, fontFamilies)
  );
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
      onOk={addFontFamily}
      onCancel={onCancel}
      form={
        <React.Fragment>
          <FormInput
            placeholder="Name your font family"
            {...nameEntry.inputProps}
          />
          <FormInput
            placeholder="List of fonts separated by commas"
            {...valueEntry.inputProps}
          />
        </React.Fragment>
      }
    />
  );
}

export default AddFontFamilyModal;
