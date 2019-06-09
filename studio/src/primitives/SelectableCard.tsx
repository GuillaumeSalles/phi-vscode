/** @jsx jsx */
import {
  jsx,
  css,
  SerializedStyles,
  InterpolationWithTheme,
  Interpolation
} from "@emotion/core";
import { card } from "../styles";

type Props = {
  children: React.ReactNode;
  isSelected: boolean;
  onClick?: () => void;
  overrides?: Interpolation;
};

export default function SelectableCard({
  children,
  isSelected,
  onClick,
  overrides
}: Props) {
  const styles = css(
    card,
    {
      padding: isSelected ? "0px" : "2px",
      border: isSelected ? "solid #0076FF 2px" : "none"
    },
    css(overrides)
  );

  return (
    <div css={styles} onClick={onClick}>
      {children}
    </div>
  );
}
