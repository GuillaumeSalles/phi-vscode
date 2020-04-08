import ts from "typescript";
import * as T from "@phi/shared";
import {
  assertUnreachable,
  createSimpleJsxElement,
  kebabToPascal,
  createComponentPropsDestructuration,
  createLayerPropertiesJsx,
  arrayToMap,
  tsNodesToString,
} from "@phi/shared";

function createLayerJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer,
  components: T.ComponentMap
) {
  if (layer.type === "component") {
    return createSimpleJsxElement(
      kebabToPascal(components.get(layer.componentId)!.name),
      [...createLayerPropertiesJsx(component, layer, components)]
    );
  }
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
      ...createLayerPropertiesJsx(component, layer, components),
    ],
    createLayerChildrenJsx(component, componentName, layer, components)
  );
}

function createLayerChildrenJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer,
  components: T.ComponentMap
): ts.JsxChild[] {
  switch (layer.type) {
    case "text":
    case "component":
    case "image":
      return [];
    case "link":
    case "container":
      return layer.children.map((child) =>
        createLayerJsx(component, componentName, child, components)
      );
  }
  assertUnreachable(layer);
}

function createComponentJsx(
  component: T.Component,
  components: T.ComponentMap
) {
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
          T.kebabToPascal(component.name),
          component.layout!,
          components
        )
      ),
    ])
  );
}

export function phiToJs(data: any) {
  const components = arrayToMap(data.components) as T.ComponentMap;

  return tsNodesToString(
    Array.from(components.values())
      .filter((c) => c.layout != null)
      .map((c) => createComponentJsx(c, components))
  );
}

export default function gatsbyJsLoader(source: string) {
  const data = JSON.parse(source);

  const result = phiToJs(data);

  return `
import React from "react"
import styles from "!style-loader!css-loader?modules=true!gatsby-plugin-phi/dist/css-loader?modules!${this.resourcePath}"

${result}
`;
}
