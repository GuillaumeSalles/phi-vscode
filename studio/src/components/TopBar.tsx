/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row } from "../styles";
import { path } from "../node";

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
      <svg
        height="18px"
        width="18px"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <radialGradient id="myGradient" cx="0.4" cy="0.6">
            <stop offset="10%" stopColor="rgb(101,129,223)" />
            <stop offset="95%" stopColor="rgb(61,77,128)" />
          </radialGradient>
        </defs>
        <circle cx="25" cy="25" r="25" fill="url('#myGradient')" />
      </svg>
      <div css={{ margin: "0 4px" }}>
        {fileName ? path.parse(fileName).name : "Untitled"}
      </div>
      {!isSaved && (
        <div
          css={{
            padding: "4px 6px",
            borderRadius: "12px",
            background: "#DDDDDD",
            fontSize: "12px"
          }}
        >
          Unsaved Changes
        </div>
      )}
    </div>
  );
}
