/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row } from "../styles";
import IconButton from "./IconButton";
import { Add, Delete, Edit } from "../icons";

type Props = {
  onAdd: () => void;
  onEdit: () => void;
  canEdit: boolean;
  onDelete: () => void;
  canDelete: boolean;
};

export default function RefActions({
  onAdd,
  onEdit,
  canEdit,
  onDelete,
  canDelete
}: Props) {
  return (
    <div css={[row, { marginLeft: "28px" }]}>
      <IconButton
        cssOverrides={{ marginRight: "12px" }}
        icon={<Add />}
        onClick={onAdd}
      />
      <IconButton
        disabled={!canEdit}
        cssOverrides={{ marginRight: "12px" }}
        icon={<Edit height={20} width={20} />}
        onClick={onEdit}
      />
      <IconButton
        disabled={!canDelete}
        icon={<Delete height={20} width={20} />}
        onClick={onDelete}
      />
    </div>
  );
}
