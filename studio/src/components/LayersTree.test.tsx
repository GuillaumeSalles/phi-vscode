import React from "react";
import * as T from "../types";
import ReactDOM from "react-dom";
import {
  LayersTreeItem,
  flattenLayer,
  getDepthsBoundaries,
  findInsertionPosition,
  isValidDropIndex
} from "./LayersTree";
import {
  makeDefaultProject,
  makeContainerLayer,
  makeDefaultColors,
  makeDefaultFontSizes,
  makeDefaultFontWeights,
  makeDefaultFontFamilies,
  makeDefaultBreakpoints,
  makeDefaultLineHeights,
  makeTextLayer
} from "../factories";

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
const root = makeContainerLayer(refs, {
  id: "root",
  children: [
    makeTextLayer(refs, { id: "T1" }),
    makeTextLayer(refs, { id: "T2" }),
    makeContainerLayer(refs, {
      id: "C3",
      children: [
        makeTextLayer(refs, { id: "T3.1" }),
        makeTextLayer(refs, { id: "T3.2" })
      ]
    })
  ]
});
const items = flattenLayer(root);

describe("findInsertionPosition", () => {
  test("move T2 as root first child", () => {
    expect(findInsertionPosition(items, { index: 0, depth: 1 })).toEqual({
      parentId: "root",
      position: 0
    });
  });

  test("move T1 as root second child", () => {
    expect(findInsertionPosition(items, { index: 1, depth: 1 })).toEqual({
      parentId: "root",
      position: 1
    });
  });

  test("move T1 as last C3 first child", () => {
    expect(findInsertionPosition(items, { index: 3, depth: 2 })).toEqual({
      parentId: "C3",
      position: 0
    });
  });

  test("move T1 as last C3 last child", () => {
    expect(findInsertionPosition(items, { index: 5, depth: 2 })).toEqual({
      parentId: "C3",
      position: 2
    });
  });

  test("move T1 as root last child", () => {
    expect(findInsertionPosition(items, { index: 5, depth: 1 })).toEqual({
      parentId: "root",
      position: 3
    });
  });
});

describe("isValidDropIndex", () => {
  test("should return false if index < 0", () => {
    expect(isValidDropIndex(items, 1, -1)).toBe(false);
  });

  test("should return false if index > list length", () => {
    expect(isValidDropIndex(items, 1, 7)).toBe(false);
  });

  test("should return false if droping inside himself", () => {
    expect(isValidDropIndex(items, 3, 4)).toBe(false);
  });
});

it("getDepthsBoundaries", () => {
  const refs = makeRefsFixture();
  const root = makeContainerLayer(refs, {
    children: [
      makeTextLayer(refs),
      makeTextLayer(refs),
      makeTextLayer(refs),
      makeContainerLayer(refs, { children: [makeTextLayer(refs)] }),
      makeTextLayer(refs)
    ]
  });
  const items = flattenLayer(root);
  expect(getDepthsBoundaries(items, 0)).toEqual({ min: 1, max: 1 });
  expect(getDepthsBoundaries(items, 1)).toEqual({ min: 1, max: 1 });
  expect(getDepthsBoundaries(items, 2)).toEqual({ min: 1, max: 1 });
  expect(getDepthsBoundaries(items, 3)).toEqual({ min: 1, max: 1 });
  expect(getDepthsBoundaries(items, 4)).toEqual({ min: 2, max: 2 });
  expect(getDepthsBoundaries(items, 5)).toEqual({ min: 1, max: 2 });
  expect(getDepthsBoundaries(items, 6)).toEqual({ min: 1, max: 1 });
});
