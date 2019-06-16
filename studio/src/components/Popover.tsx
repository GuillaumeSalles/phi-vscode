/** @jsx jsx */
import { jsx } from "@emotion/core";
import ReactDOM from "react-dom";

const popoverRoot = document.getElementById("popover-root")!;

type Props = {
  anchor: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
};

export default function Popover({
  isOpen,
  onDismiss,
  anchor,
  children
}: Props) {
  if (!isOpen || anchor.current == null) {
    popoverRoot.style.display = "none";
    return null;
  }

  const boundingRect = anchor.current.getBoundingClientRect();
  popoverRoot.style.display = "inline";
  return ReactDOM.createPortal(
    <div
      css={{
        height: "100%",
        width: "100%"
      }}
      onClick={onDismiss}
    >
      <div
        css={{
          position: "absolute",
          left: boundingRect.left,
          top: boundingRect.top + boundingRect.height
        }}
      >
        {children}
      </div>
    </div>,
    popoverRoot
  );
}
