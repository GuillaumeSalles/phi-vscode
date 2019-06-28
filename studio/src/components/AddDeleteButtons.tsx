/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row } from "../styles";
import IconButton from "./IconButton";
import { Add, Delete } from "../icons";

type Props = {
  onAddClick: () => void;
  onDeleteClick: () => void;
  isDeleteDisabled: boolean;
};

export default function AddDeleteButtons({
  onAddClick,
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
        disabled={isDeleteDisabled}
        icon={<Delete height={20} width={20} />}
        onClick={onDeleteClick}
      />
    </div>
  );
}
