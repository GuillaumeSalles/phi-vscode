/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import OkCancelModal from "../../../components/OkCancelModal";
import AddButton from "../../../components/AddButton";
import {
  useDialogForm,
  FormSelect,
  useSelectFormEntry,
} from "../../../components/Form";
import uuid from "uuid/v4";
import React, { useCallback } from "react";
import SecondaryButton from "../../../components/SecondaryButton";
import Button from "../../../components/Button";
import Section from "./Section";

type Props = {
  layer: T.Layer;
  onChange: (id?: string) => void;
  onAdd: (id: string, breakpoint: T.Ref) => void;
  selectedId?: string;
  refs: T.Refs;
};

function mediaQueryToString(mediaQuery: T.MediaQuery, refs: T.Refs) {
  const bp = refs.breakpoints.get(mediaQuery.minWidth.id);
  if (bp == null) {
    throw new Error("Breakpoint not found for MediaQuery");
  }
  return `@media (min-width: ${bp.name})`;
}

function breakpointEntryToOption(
  entry: [string, T.BreakpointDefinition]
): [string, string] {
  return [entry[0], `@media (min-width: ${entry[1].name})`];
}

export default function MediaQueriesEditor({
  layer,
  selectedId,
  onAdd,
  onChange,
  refs,
}: Props) {
  const defaultMediaQuery: [string, string] = ["default", "default"];
  const options = [defaultMediaQuery].concat(
    layer.mediaQueries.map((mq) => [mq.id, mediaQueryToString(mq, refs)])
  );

  const canAddMediaQueries = options.length < refs.breakpoints.size + 1;

  const existing = new Set(layer.mediaQueries.map((m) => m.minWidth.id));
  const newOptions = Array.from(refs.breakpoints.entries())
    .filter((entry) => !existing.has(entry[0]))
    .map(breakpointEntryToOption);

  const selectedMediaQueryEntry = useSelectFormEntry(undefined);
  const addMediaQueryDialog = useDialogForm([selectedMediaQueryEntry], () => {
    onAdd(uuid(), {
      type: "ref",
      id:
        selectedMediaQueryEntry.value != null
          ? selectedMediaQueryEntry.value
          : newOptions[0][0],
    });
    selectedMediaQueryEntry.setValue(undefined);
  });

  const onChangeCallback = useCallback(
    (mediaQuery) => {
      onChange(mediaQuery === "default" ? undefined : mediaQuery);
    },
    [onChange]
  );

  return (
    <Section
      title="Media Queries"
      topRightButton={
        <AddButton
          disabled={!canAddMediaQueries}
          onClick={addMediaQueryDialog.open}
        />
      }
    >
      <Field label="Breakpoint">
        <Select
          width="100%"
          value={selectedId || "default"}
          onChange={onChangeCallback}
          options={options}
        />
      </Field>
      {newOptions.length > 0 && (
        <OkCancelModal
          title="Add new media query"
          description="Select a breakpoint that has not been used before on this layer."
          {...addMediaQueryDialog.dialogProps}
          form={
            <React.Fragment>
              <FormSelect
                width="100%"
                options={newOptions}
                placeholder="Select a breakpoint"
                {...selectedMediaQueryEntry.inputProps}
                // TODO: Find a better way
                value={
                  selectedMediaQueryEntry.value != null
                    ? selectedMediaQueryEntry.value
                    : newOptions[0][0]
                }
              />
            </React.Fragment>
          }
          buttons={
            <React.Fragment>
              <SecondaryButton
                text="Cancel"
                {...addMediaQueryDialog.cancelButtonProps}
              />
              <Button text="Add" {...addMediaQueryDialog.okButtonProps} />
            </React.Fragment>
          }
        />
      )}
    </Section>
  );
}
