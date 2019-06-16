/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props = {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function IconButton({ icon, onClick, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      css={{
        border: "none",
        margin: 0,
        padding: 0,
        ":focus": {
          outline: "none"
        }
      }}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
