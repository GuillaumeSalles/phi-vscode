/** @jsx jsx */
import { jsx } from "@emotion/core";
import ReactDOM from "react-dom";

const popoverRoot = document.getElementById("popover-root")!;

type Position = "bottom" | "top" | "bottom-right";

type Props = {
  anchor: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  position: Position;
};

function positionToCss(position: Position, boundingRect: ClientRect | DOMRect) {
  const style = {
    position: "absolute"
  } as any;

  switch (position) {
    case "bottom":
      style.left = boundingRect.left;
      style.top = boundingRect.top + boundingRect.height;
      break;
    case "bottom-right":
      style.right = window.innerWidth - boundingRect.right;
      style.top = boundingRect.top + boundingRect.height;
      break;
    case "top":
      style.left = boundingRect.left;
      style.bottom = window.innerHeight - boundingRect.top;
      break;
  }

  return style;
}

export default function Popover({
  isOpen,
  onDismiss,
  anchor,
  children,
  position
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
      <div css={positionToCss(position, boundingRect)}>{children}</div>
    </div>,
    popoverRoot
  );
}
