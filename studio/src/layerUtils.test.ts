import React from "react";
import * as T from "./types";
import ReactDOM from "react-dom";
import { findLayerById } from "./layerUtils";
import {
  makeContainerLayer,
  makeDefaultColors,
  makeDefaultFontSizes,
  makeDefaultFontWeights,
  makeDefaultFontFamilies,
  makeDefaultBreakpoints,
  makeDefaultLineHeights,
  makeTextLayer
} from "./factories";

function makeRefsFixture(): T.Refs {
  return {
    isSaved: true,
    fileName: "",
    colors: makeDefaultColors(),
    fontSizes: makeDefaultFontSizes(),
    fontWeights: makeDefaultFontWeights(),
    fontFamilies: makeDefaultFontFamilies(),
    lineHeights: makeDefaultLineHeights(),
    breakpoints: makeDefaultBreakpoints(),
    components: new Map()
  };
}

const refs = makeRefsFixture();

test("findLayerById", () => {
  const root = makeContainerLayer(refs, {
    id: "1",
    children: [
      makeContainerLayer(refs, {
        id: "1.1",
        children: [
          makeContainerLayer(refs, {
            id: "1.1.1",
            children: [makeContainerLayer(refs, { id: "1.1.1.1" })]
          })
        ]
      })
    ]
  });
  expect(findLayerById(root, "1.1.1.1")!.id).toEqual("1.1.1.1");
});
