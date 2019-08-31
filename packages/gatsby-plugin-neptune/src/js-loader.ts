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
      ...createLayerPropertiesJsx(component, layer, components)
    ],
    createLayerChildrenJsx(component, componentName, layer, components)
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

function layerPropNameToJsxAttributeName(prop: string) {
  if (prop === "content") {
    return "children";
  }
  return prop;
}

function componentLayerAttributeMap(
  layer: T.ComponentLayer,
  components: T.ComponentMap
) {
  const component = components.get(layer.componentId);
  if (component == null) {
    throw new Error(`Component with id ("${layer.componentId}") not found`);
  }
  const map = new Map();
  for (let prop in layer.props) {
    const componentProp = component.props.find(
      componentProp => componentProp.name === prop
    );
    if (componentProp == null) {
      throw new Error(`Component prop with id ("${prop}") not found`);
    }
    map.set(
      layerPropNameToJsxAttributeName(kebabToCamel(componentProp.name)),
      ts.createStringLiteral(layer.props[prop])
    );
  }
  return map;
}

function createSimpleAttributeMap(
  layer: T.Layer,
  components: T.ComponentMap
): Map<string, ts.Expression> {
  switch (layer.type) {
    case "container":
      return new Map();
    case "component":
      return componentLayerAttributeMap(layer, components);
    case "text":
    case "link":
    case "image":
      return new Map(
        Object.entries(layer.props)
          .filter(([propName, value]) => value != null)
          .map(([propName, value]) => {
            return [
              layerPropNameToJsxAttributeName(propName),
              ts.createStringLiteral(value!)
            ];
          })
      );
  }
}

function createLayerPropertiesJsx(
  component: T.Component,
  layer: T.Layer,
  components: T.ComponentMap
): ts.JsxAttribute[] {
  const attributesMap = createSimpleAttributeMap(layer, components);

  for (let prop in layer.bindings) {
    const propName = layer.bindings[prop].propName;

    const componentProp = component.props.find(p => p.name === propName);
    if (componentProp == null) {
      throw new Error(`Prop (${propName}) not found`);
    }
    attributesMap.set(
      layerPropNameToJsxAttributeName(kebabToCamel(prop)),
      ts.createIdentifier(kebabToCamel(componentProp.name))
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
      return layer.children.map(child =>
        createLayerJsx(component, componentName, child, components)
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
          kebabToPascal(component.name),
          component.layout!,
          components
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
      .map(c => createComponentJsx(c, components))
  );
}

export default function gatsbyJsLoader(source: string) {
  console.log("Inside gatsby-js-loader");

  const data = JSON.parse(source);

  const result = neptuneToJs(data);

  return `
import React from "react"
import styles from "!style-loader!css-loader?modules=true!gatsby-plugin-neptune/dist/css-loader?modules!${this.resourcePath}"

${result}
`;
}
