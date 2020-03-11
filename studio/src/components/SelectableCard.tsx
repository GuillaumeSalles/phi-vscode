/** @jsx jsx */
import { jsx, css, Interpolation } from "@emotion/core";
import { selectableCard, colors } from "../styles";

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
    selectableCard,
    {
      borderColor: isSelected ? colors.selectedCardBorder : "transparent"
    },
    css(overrides)
  );

  return (
    <div css={styles} onClick={onClick}>
      {children}
    </div>
  );
}
