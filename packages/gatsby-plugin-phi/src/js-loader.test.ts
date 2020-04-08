import { phiToJs } from "./js-loader";
import prettier from "prettier";

const colors = [
  {
    id: "color-1",
    name: "color-name",
    value: "#000000",
  },
];

const fontSizes = [
  {
    id: "fontSize-1",
    name: "default",
    value: "15px",
  },
];

const fontFamilies = [
  {
    id: "fontFamily-1",
    name: "default",
    value: "-apple-system",
  },
];

const breakpoints = [
  {
    id: "breakpoint-1",
    name: "default",
    value: { type: "px", value: 544 },
  },
];

const data = {
  breakpoints,
  colors,
  fontFamilies,
  fontSizes,
};

test("component without props and single image layer", () => {
  const data = {};
  expect(
    prettier.format(
      phiToJs({
        ...data,
        components: [
          {
            id: "componentId",
            name: "component-name",
            props: [],
            layout: {
              type: "image",
              id: "image-layer-1",
              name: "image",
              tag: "img",
              props: {
                src: "images/DefaultProfile.png",
                alt: "profile-picture",
                height: "",
                width: "",
              },
              mediaQueries: [],
              style: {
                display: "block",
                borderTopLeftRadius: "50%",
                borderTopRightRadius: "50%",
                borderBottomRightRadius: "50%",
                borderBottomLeftRadius: "50%",
                height: "100%",
                width: "100%",
                borderTopColor: {
                  type: "ref",
                  id: "color-1",
                },
                borderRightColor: {
                  type: "ref",
                  id: "color-1",
                },
                borderBottomColor: {
                  type: "ref",
                  id: "color-1",
                },
                borderLeftColor: {
                  type: "ref",
                  id: "color-1",
                },
                borderTopStyle: "solid",
                borderRightStyle: "solid",
                borderBottomStyle: "solid",
                borderLeftStyle: "solid",
                borderTopWidth: "4px",
                borderRightWidth: "4px",
                borderBottomWidth: "4px",
                borderLeftWidth: "4px",
                maxWidth: "136px",
                maxHeight: "136px",
              },
              bindings: {},
            },
            examples: [],
          },
        ],
      })
    )
  ).toBe(``);
});
