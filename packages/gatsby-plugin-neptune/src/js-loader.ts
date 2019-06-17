import ts from "typescript";
import * as T from "../../../studio/src/types";
import loaderUtils from "loader-utils";
import { arrayToMap } from "./shared";

function tsNodesToString(nodes: ReadonlyArray<ts.Node>) {
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  });

  return printer.printList(
    ts.ListFormat.MultiLine | ts.ListFormat.PreferNewLine,
    ts.createNodeArray(nodes),
    resultFile
  );
}

function createLayerJsx(componentName: string, layer: T.Layer) {
  switch (layer.type) {
    case "text":
      return createTextLayerJsx(componentName, layer);
    default:
      throw new Error("Unsupported layer type");
  }
}

function createTextLayerJsx(componentName: string, layer: T.TextLayer) {
  return createSimpleJsxElement(layer.tag, [
    ts.createJsxAttribute(
      ts.createIdentifier("className"),
      ts.createJsxExpression(
        undefined,
        ts.createElementAccess(
          ts.createIdentifier("styles"),
          ts.createStringLiteral(`${componentName}-${layer.name}`)
        )
      )
    ),
    ts.createJsxAttribute(
      ts.createIdentifier("children"),
      ts.createJsxExpression(
        undefined,
        ts.createStringLiteral(layer.text || "")
      )
    )
  ]);
}

function createComponentJsx(component: T.Component) {
  return ts.createFunctionDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    component.name,
    undefined,
    [],
    undefined,
    ts.createBlock([
      ts.createReturn(createLayerJsx(component.name, component.layout!))
    ])
  );
}

function createSimpleJsxElement(
  name: string,
  properties: ReadonlyArray<ts.JsxAttributeLike>,
  children: ReadonlyArray<ts.JsxChild> = []
) {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createIdentifier(name),
      undefined,
      ts.createJsxAttributes(properties)
    ),
    children,
    ts.createJsxClosingElement(ts.createIdentifier(name))
  );
}

function createJsxOpeningFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxOpeningFragment);
  return node as ts.JsxOpeningFragment;
}

function createJsxClosingFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxClosingFragment);
  return node as ts.JsxClosingFragment;
}

export function neptuneToJs(data: any) {
  const components: T.ComponentMap = arrayToMap(data.components);

  return tsNodesToString(
    Array.from(components.values())
      .filter(c => c.layout != null)
      .map(createComponentJsx)
  );
}

export default function gatsbyJsLoader(source: string) {
  console.log("Inside gatsby-js-loader");

  const data = JSON.parse(source);

  const result = neptuneToJs(data);

  return `
import React from "react"
import styles from "!style-loader!css-loader?modules=true!gatsby-plugin-neptune/dist/css-loader?modules!${
    this.resourcePath
  }"

${result}
`;
}
