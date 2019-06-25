/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import uuid from "uuid/v4";
import * as T from "../../../types";
import OkCancelModal from "../../../components/OkCancelModal";
import Select from "../../../components/Select";

type Props<TStyle> = {
  isOpen: boolean;
  onAdd: (id: string, breakpoint: T.Ref) => void;
  onCancel: () => void;
  refs: T.Refs;
  layer: T.ILayer<TStyle>;
};

function breakpointEntryToOption(
  entry: [string, T.BreakpointDefinition]
): [string, string] {
  return [entry[0], `@media (min-width: ${entry[1].name})`];
}

export default function AddMediaQueryModal<TStyle>({
  isOpen,
  onAdd,
  onCancel,
  layer,
  refs
}: Props<TStyle>) {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  const existing = new Set(layer.mediaQueries.map(m => m.minWidth.id));
  const options = Array.from(refs.breakpoints.entries())
    .filter(entry => !existing.has(entry[0]))
    .map(breakpointEntryToOption);

  return options.length > 0 ? (
    <OkCancelModal
      isOpen={isOpen}
      title="Add new media query"
      description="Select a breakpoint that has not been used before on this layer."
      onOk={() =>
        onAdd(uuid(), {
          type: "ref",
          id: selectedItem != null ? selectedItem : options[0][0]
        })
      }
      onCancel={onCancel}
      form={
        <React.Fragment>
          <Select
            width="100%"
            options={options}
            value={selectedItem != null ? selectedItem : options[0][0]}
            onChange={setSelectedItem}
          />
        </React.Fragment>
      }
    />
  ) : null;
}
