import ts from "typescript";
import * as T from "../../../studio/src/types";
import loaderUtils from "loader-utils";
import {
  arrayToMap,
  kebabToPascal,
  assertUnreachable,
  kebabToCamel
} from "./shared";

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

function createLayerJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer
) {
  return createSimpleJsxElement(
    layer.tag,
    [
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
      ...createLayerPropertiesJsx(component, layer)
    ],
    createLayerChildrenJsx(component, componentName, layer)
  );
}

function createStringAttributeJsx(
  attributeName: string,
  stringLiteral: string
) {
  return ts.createJsxAttribute(
    ts.createIdentifier(attributeName),
    ts.createJsxExpression(undefined, ts.createStringLiteral(stringLiteral))
  );
}

function createGenericHtmlAttributeMap(
  layer: T.Layer
): Map<string, ts.Expression> {
  switch (layer.type) {
    case "text":
      return new Map([["children", ts.createStringLiteral(layer.text)]]);
    case "link":
      return new Map([
        ["children", ts.createStringLiteral(layer.text)],
        ["href", ts.createStringLiteral(layer.href)]
      ]);
    case "container":
      return new Map();
  }
  assertUnreachable(layer);
}

function layerPropNameToJsxAttributeName(layerPropName: string): string {
  const map = new Map([["text", "children"], ["href", "href"]]);
  return map.get(layerPropName)!;
}

function createLayerPropertiesJsx(
  component: T.Component,
  layer: T.Layer
): ts.JsxAttribute[] {
  const attributesMap = createGenericHtmlAttributeMap(layer);

  for (let override of component.overrides.filter(
    o => o.layerId === layer.id
  )) {
    const prop = component.props.find(p => p.id === override.propId);
    if (prop == null) {
      throw new Error(`Prop with id (${override.propId}) not found`);
    }
    attributesMap.set(
      layerPropNameToJsxAttributeName(override.layerProp),
      ts.createIdentifier(kebabToCamel(prop.name))
    );
  }

  return Array.from(attributesMap.entries()).map(([attrName, node]) => {
    return ts.createJsxAttribute(
      ts.createIdentifier(attrName),
      ts.createJsxExpression(undefined, node)
    );
  });
}

function createLayerChildrenJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer
): ts.JsxChild[] {
  switch (layer.type) {
    case "text":
    case "link":
      return [];
    case "container":
      return layer.children.map(child =>
        createLayerJsx(component, componentName, child)
      );
  }
  assertUnreachable(layer);
}

function createComponentPropsDestructuration(component: T.Component) {
  if (component.props.length === 0) {
    return [];
  }

  return [
    ts.createParameter(
      undefined,
      undefined,
      undefined,
      ts.createObjectBindingPattern(
        component.props.map(prop => {
          return ts.createBindingElement(
            undefined,
            undefined,
            ts.createIdentifier(kebabToCamel(prop.name)),
            undefined
          );
        })
      ),
      undefined,
      undefined,
      undefined
    )
  ];
}

function createComponentJsx(component: T.Component) {
  return ts.createFunctionDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    kebabToPascal(component.name),
    undefined,
    createComponentPropsDestructuration(component),
    undefined,
    ts.createBlock([
      ts.createReturn(
        createLayerJsx(
          component,
          kebabToPascal(component.name),
          component.layout!
        )
      )
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
