/** @jsx jsx */
import { jsx } from "@emotion/core";
import ReactDOM from "react-dom";
import { stopKeydownPropagationIfNecessary } from "../utils";

const modalRoot = document.getElementById("modal-root")!;

type Props = {
  isOpen: boolean;
  children: any;
};

export default function Modal(props: Props) {
  return ReactDOM.createPortal(
    <div
      css={{
        display: props.isOpen ? "flex" : "none",
        height: "100vh",
        width: "100vw",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <div css={{ zIndex: 1 }} onKeyDown={stopKeydownPropagationIfNecessary}>
        {props.children}
      </div>
      <div
        css={{
          backgroundColor: "rgb(0, 0, 0)",
          bottom: "0px",
          height: "100%",
          left: "0px",
          opacity: 0,
          pointerEvents: "all",
          position: "fixed",
          top: "0px",
          width: "100%",
          transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s"
        }}
      />
    </div>,
    modalRoot
  );
}
