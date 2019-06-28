/** @jsx jsx */
import { jsx } from "@emotion/core";
import { ChangeEvent, KeyboardEvent, forwardRef } from "react";
import { colors } from "../../styles";

type Props<TValue> = {
  width?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLSelectElement>) => void;
  value?: string;
  isInvalid?: boolean;
  error?: string;
  options: Array<[TValue, string]>;
};

export default forwardRef<HTMLSelectElement, Props<string>>(
  (
    {
      width,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      value,
      options
    }: Props<string>,
    ref: React.Ref<HTMLSelectElement>
  ) => {
    return (
      <div
        css={{
          WebkitAppearance: "none",
          display: "inline-flex",
          height: "24px",
          fontSize: "12px",
          textTransform: "uppercase",
          userSelect: "none",
          fontWeight: 100,
          position: "relative",
          whiteSpace: "nowrap",
          lineHeight: 0,
          width,
          minWidth: width,
          background: "rgb(255, 255, 255)",
          outline: "none",
          borderWidth: "0 0 1px 0",
          borderStyle: "solid",
          borderColor: "transparent",
          borderImage: "initial",
          overflow: "hidden",
          transition:
            "border 0.2s ease 0s, background 0.2s ease 0s, color 0.2s ease-out 0s",
          ":focus-within": {
            borderColor: colors.primary
          }
        }}
      >
        <select
          ref={ref}
          css={{
            WebkitAppearance: "none",
            height: "100%",
            boxShadow: "none",
            lineHeight: "22px",
            fontSize: "12px",
            marginRight: "-20px",
            width: "calc(100% + 20px)",
            textTransform: "none",
            borderWidth: "initial",
            borderStyle: "none",
            borderColor: "initial",
            borderImage: "initial",
            padding: "0px 20px 0px 0px",
            ":focus": {
              outline: "none"
            },
            borderRadius: "0px"
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        >
          {options.map(option => (
            <option key={option[0]} value={option[0]}>
              {option[1]}
            </option>
          ))}
        </select>
        <div
          css={{
            width: "12px",
            height: "100%",
            position: "absolute",
            right: "0px",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderLeft: "none",
            transition: "border 0.2s ease 0s"
          }}
        >
          <svg width="7" height="17" viewBox="0 0 7 12" fill="none">
            <path d="M0.642491 3.35053L0.292945 3.70804L1.00798 4.40714L1.35752 4.04962L0.642491 3.35053ZM3.75752 1.59491L4.10707 1.23739L3.39204 0.538299L3.04249 0.895815L3.75752 1.59491ZM5.58506 4.04651L5.93149 4.40704L6.65256 3.71417L6.30613 3.35364L5.58506 4.04651ZM3.95354 0.9053L3.6071 0.544767L2.88604 1.23763L3.23247 1.59817L3.95354 0.9053ZM1.35752 7.95041L1.00797 7.59289L0.292938 8.29198L0.642485 8.6495L1.35752 7.95041ZM3.04248 11.1042L3.39203 11.4617L4.10706 10.7626L3.75751 10.4051L3.04248 11.1042ZM6.36054 8.64636L6.70697 8.28583L5.98591 7.59296L5.63947 7.95349L6.36054 8.64636ZM3.28688 10.4018L2.94045 10.7624L3.66152 11.4552L4.00795 11.0947L3.28688 10.4018ZM1.35752 4.04962L3.75752 1.59491L3.04249 0.895815L0.642491 3.35053L1.35752 4.04962ZM6.30613 3.35364L3.95354 0.9053L3.23247 1.59817L5.58506 4.04651L6.30613 3.35364ZM0.642485 8.6495L3.04248 11.1042L3.75751 10.4051L1.35752 7.95041L0.642485 8.6495ZM5.63947 7.95349L3.28688 10.4018L4.00795 11.0947L6.36054 8.64636L5.63947 7.95349Z" />
          </svg>
        </div>
      </div>
    );
  }
);
