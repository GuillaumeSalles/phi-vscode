/** @jsx jsx */
import { jsx } from "@emotion/core";
import Button from "../../components/Button";
import { Layout } from "../../components/Layout";
import Section from "../ComponentView/Editors/Section";
import { column } from "../../styles";
import { Logo } from "../../icons";

type Props = {
  onNewProjectClick: () => void;
  openProject: () => void;
};

export default function Home({ onNewProjectClick, openProject }: Props) {
  return (
    <Layout
      left={
        <Section title="Neptune Studio">
          <div css={[column, { marginTop: "8px" }]}>
            <Button
              text="Create new project"
              onClick={onNewProjectClick}
              margin="0 0 8px 0"
            />
            <Button text="Open project" onClick={openProject} />
          </div>
        </Section>
      }
      center={null}
    ></Layout>
  );
}
