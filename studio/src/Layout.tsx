/** @jsx jsx */
import { jsx } from "@emotion/core";
import { row, column } from "./styles";

type Props = {
  left: React.ReactNode;
  children: React.ReactNode;
};

function Layout({ left, children }: Props) {
  return (
    <div css={[row, { height: "100%" }]}>
      <div
        css={[
          row,
          {
            flex: "1 1 auto",
            height: "100%"
          }
        ]}
      >
        <div
          css={[
            column,
            {
              width: "180px",
              minWidth: "180px",
              borderRight: "1px solid #eaeaea",
              bottom: 0
            }
          ]}
        >
          {left}
        </div>

        <div
          css={{
            overflowY: "auto",
            height: "100%",
            flex: "1 1 auto"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
