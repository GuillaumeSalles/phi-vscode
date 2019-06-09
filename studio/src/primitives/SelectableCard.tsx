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
      borderColor: isSelected ? "#0076FF" : "transparent"
    },
    css(overrides)
  );

  return (
    <div css={styles} onClick={onClick}>
      {children}
    </div>
  );
}
