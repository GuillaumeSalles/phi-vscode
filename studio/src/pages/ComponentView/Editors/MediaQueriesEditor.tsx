/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, sectionTitle, row } from "../../../styles";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import IconButton from "../../../components/IconButton";
import { Add } from "../../../icons";
import Modal from "../../../components/Modal";
import { useState } from "react";
import AddMediaQueryModal from "./AddMediaQueryModal";

type Props<TStyle> = {
  items: T.MediaQuery<TStyle>[];
  onChange: (id: string) => void;
  onAdd: (id: string, breakpoint: T.Ref) => void;
  selectedId: string;
  refs: T.Refs;
};

function mediaQueryToString<TStyle>(
  mediaQuery: T.MediaQuery<TStyle>,
  refs: T.Refs
) {
  const bp = refs.breakpoints.get(mediaQuery.minWidth.id);
  if (bp == null) {
    throw new Error("Breakpoint not found for MediaQuery");
  }
  return `@media (min-width: ${bp.name})`;
}

export default function MediaQueriesEditor<TStyle>({
  items,
  selectedId,
  onAdd,
  onChange,
  refs
}: Props<TStyle>) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMediaQuery: [string, string] = ["default", "default"];
  const options = [defaultMediaQuery].concat(
    items.map(mq => [mq.id, mediaQueryToString(mq, refs)])
  );

  const canAddMediaQueries = options.length < refs.breakpoints.size + 1;

  return (
    <div css={[column, { flex: "0 0 auto", padding: "8px" }]}>
      <div
        css={[
          row,
          {
            margin: "0 8px",
            justifyContent: "space-between"
          }
        ]}
      >
        <h4 css={[sectionTitle]}>Media Queries</h4>
        <IconButton
          disabled={!canAddMediaQueries}
          icon={
            <Add color={canAddMediaQueries ? "black" : "rgb(204, 204, 204)"} />
          }
          onClick={() => setIsOpen(true)}
        />
      </div>
      <Field label="Breakpoint">
        <Select
          width="100%"
          value={selectedId}
          onChange={onChange}
          options={options}
        />
      </Field>
      <Modal isOpen={isOpen}>
        <AddMediaQueryModal
          refs={refs}
          existingMediaQueries={items}
          onAdd={(newId, breakpoint) => {
            onAdd(newId, breakpoint);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
}
