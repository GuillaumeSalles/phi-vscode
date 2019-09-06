/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column } from "../../styles";
import SelectableCard from "../../components/SelectableCard";

type Props = {
  name: string;
  onClick: () => void;
  image: string;
};

export default function Example({ name, image, onClick }: Props) {
  return (
    <div css={[column, { margin: "0 0 16px 16px" }]}>
      <SelectableCard
        isSelected={false}
        onClick={onClick}
        overrides={{ padding: "16px" }}
      >
        <img css={{ height: "150px" }} src={image} />
      </SelectableCard>
      <p>{name}</p>
    </div>
  );
}
