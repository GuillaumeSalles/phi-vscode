/** @jsx jsx */
import { jsx } from "@emotion/core";
import IconButton from "./IconButton";
import { Add } from "../icons";
import { colors } from "../styles";

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

export default function AddButton({ disabled, onClick }: Props) {
  return (
    <IconButton
      disabled={disabled}
      icon={<Add color={disabled ? "rgb(204, 204, 204)" : colors.iconColor} />}
      onClick={onClick}
    />
  );
}
