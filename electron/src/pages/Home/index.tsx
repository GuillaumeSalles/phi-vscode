/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import Button from "../../components/Button";
import { Layout } from "../../components/Layout";
import Section from "../ComponentView/Editors/Section";
import Example from "./Example";
import { column, row, heading, sectionTitle } from "../../styles";
import { jsonToRefs } from "../../fileUtils";
import Twitch from "../../examples/Twitch.json";
import twitchLogo from "../../images/twitch-logo.png";
import Twitter from "../../examples/Twitter.json";
import twitterLogo from "../../images/twitter-logo.png";
import { Logo } from "../../icons";

type Props = {
  onNewProjectClick: () => void;
  openProject: () => void;
  openExampleProject: (refs: T.Refs) => void;
};

export default function Home({
  onNewProjectClick,
  openProject,
  openExampleProject
}: Props) {
  return (
    <Layout
      left={
        <div css={[column, { padding: "8px" }]}>
          <div css={[row, { alignItems: "center" }]}>
            <Logo height={24} width={24} />
            <h4 css={[sectionTitle, { marginLeft: "4px" }]}>Phi for VS Code</h4>
          </div>
          <div css={[column, { marginTop: "8px" }]}>
            <Button
              text="Create new project"
              onClick={onNewProjectClick}
              margin="0 0 8px 0"
            />
            <Button text="Open project" onClick={openProject} />
          </div>
        </div>
      }
      center={
        <div css={[column, { padding: "16px" }]}>
          <h1 css={[heading]}>Example files</h1>
          <div css={[row, { margin: "16px 0" }]}>
            <Example
              name="Twitch"
              image={twitchLogo}
              onClick={() =>
                openExampleProject(jsonToRefs(undefined, false, Twitch))
              }
            />
            <Example
              name="Twitter"
              image={twitterLogo}
              onClick={() =>
                openExampleProject(jsonToRefs(undefined, false, Twitter))
              }
            />
          </div>
        </div>
      }
    ></Layout>
  );
}
