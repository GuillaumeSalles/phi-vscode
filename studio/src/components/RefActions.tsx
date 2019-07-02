/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row } from "../styles";
import IconButton from "./IconButton";
import { Add, Delete, Edit } from "../icons";

type Props = {
  onAddClick: () => void;
  onEditClick?: () => void;
  canEdit: boolean;
  onDeleteClick: () => void;
  isDeleteDisabled: boolean;
};

export default function RefActions({
  onAddClick,
  onEditClick,
  canEdit,
  onDeleteClick,
  isDeleteDisabled
}: Props) {
  return (
    <div css={[row, { marginLeft: "28px" }]}>
      <IconButton
        cssOverrides={{ marginRight: "12px" }}
        icon={<Add />}
        onClick={onAddClick}
      />
      <IconButton
        disabled={!canEdit}
        cssOverrides={{ marginRight: "12px" }}
        icon={<Edit height={20} width={20} />}
        onClick={onEditClick}
      />
      <IconButton
        disabled={isDeleteDisabled}
        icon={<Delete height={20} width={20} />}
        onClick={onDeleteClick}
      />
    </div>
  );
}
