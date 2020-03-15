/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row, colors } from "../styles";
import { Logo } from "../icons";

type Props = {
  fileName: string | undefined;
  isSaved: boolean;
};

export default function TopBar({ fileName, isSaved }: Props) {
  return (
    <div
      css={[
        row,
        {
          height: "32px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }
      ]}
    >
      <Logo height={18} width={18} />
      <div css={{ margin: "0 4px" }}>
        {fileName ? fileName : "Untitled"}
      </div>
      {!isSaved && (
        <div
          css={{
            padding: "4px 6px",
            borderRadius: "12px",
            background: colors.front,
            fontSize: "12px"
          }}
        >
          Unsaved Changes
        </div>
      )}
    </div>
  );
}
