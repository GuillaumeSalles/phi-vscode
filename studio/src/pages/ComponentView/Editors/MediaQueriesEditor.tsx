/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, sectionTitle, row } from "../../../styles";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import AddMediaQueryModal from "./AddMediaQueryModal";
import { useOkCancelModal } from "../../../components/AddModal";
import AddButton from "../../../components/AddButton";

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
  const modal = useOkCancelModal();

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
        <AddButton disabled={!canAddMediaQueries} onClick={modal.open} />
      </div>
      <Field label="Breakpoint">
        <Select
          width="100%"
          value={selectedId}
          onChange={onChange}
          options={options}
        />
      </Field>
      <AddMediaQueryModal
        isOpen={modal.isOpen}
        refs={refs}
        existingMediaQueries={items}
        onAdd={(newId, breakpoint) => {
          onAdd(newId, breakpoint);
          modal.close();
        }}
        onCancel={modal.close}
      />
    </div>
  );
}
