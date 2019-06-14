/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
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
