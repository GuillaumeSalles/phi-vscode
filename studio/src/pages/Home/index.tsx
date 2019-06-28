/** @jsx jsx */
import { jsx } from "@emotion/core";
import Button from "../../components/Button";

type Props = {
  onNewProjectClick: () => void;
};

export default function Home({ onNewProjectClick }: Props) {
  return (
    <div>
      <Button text="New" onClick={onNewProjectClick} />
    </div>
  );
}
