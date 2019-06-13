/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props = {
  text: string;
  onClick?: () => void;
};

export default function ModalButton({ text, onClick }: Props) {
  return (
    <button
      css={{
        color: "rgb(153, 153, 153)",
        cursor: "pointer",
        fontSize: "12px",
        textAlign: "center",
        textTransform: "uppercase",
        background: "rgb(255, 255, 255)",
        borderWidth: "initial",
        borderStyle: "none",
        borderColor: "initial",
        borderImage: "initial",
        outline: "none",
        padding: "19px 0px",
        textDecoration: "none",
        transition: "all 200ms ease-in-out 0s",
        flex: "1 1 100%",
        ":not(:only-child):not(:last-child)": {
          borderRight: "1px solid rgb(234, 234, 234);"
        },
        ":last-child": {
          color: "rgb(0, 0, 0)"
        },
        ":hover": {
          color: "rgb(0, 0, 0)",
          background: "rgb(250, 250, 250)"
        },
        ":focus": {
          color: "rgb(0, 0, 0)",
          background: "rgb(250, 250, 250)"
        }
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
