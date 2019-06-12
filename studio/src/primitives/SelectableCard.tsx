/** @jsx jsx */
import {
  jsx,
  css,
  SerializedStyles,
  InterpolationWithTheme,
  Interpolation
} from "@emotion/core";
import { card, colors } from "../styles";

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
      borderColor: isSelected ? colors.primary : "transparent"
    },
    css(overrides)
  );

  return (
    <div css={styles} onClick={onClick}>
      {children}
    </div>
  );
}
