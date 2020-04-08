import { makeJsxLayerProps, forwardJsxLayerProps } from "./Layer";
import {
  makeLinkLayer,
  makeDefaultProject,
  makeComponent,
  makeComponentProp,
  makeComponentLayer,
} from "../../factories";
import { set } from "../../helpers/immutable-map";

const width = 500;

describe("makeJsxLayerProps", () => {
  it("should build props without binding properly", () => {
    const refs = makeDefaultProject();
    const layer = makeLinkLayer(refs, {
      props: {
        href: "href-value",
      },
    });
    expect(makeJsxLayerProps(layer, refs, width, {}).href).toBe("href-value");
  });

  it("should build props with binding properly", () => {
    let refs = makeDefaultProject();
    const layer = makeLinkLayer(refs, {
      props: {
        href: "href-value",
      },
      bindings: {
        href: {
          propName: "component-prop-href",
        },
      },
    });
    const component = makeComponent({
      props: [makeComponentProp({ name: "component-prop-href" })],
    });
    refs = {
      ...refs,
      components: refs.components.set("componentId", component),
    };
    expect(
      makeJsxLayerProps(layer, refs, width, {
        ["component-prop-href"]: "href-new-value",
      }).href
    ).toBe("href-new-value");
  });

  it("should build props with binding properly", () => {
    let refs = makeDefaultProject();
    const layer = makeLinkLayer(refs, {
      props: {
        href: "href-value",
      },
      bindings: {
        href: {
          propName: "component-prop-href",
        },
      },
    });
    const component = makeComponent({
      props: [makeComponentProp({ name: "component-prop-href" })],
    });
    refs = {
      ...refs,
      components: refs.components.set("componentId", component),
    };
    expect(
      makeJsxLayerProps(layer, refs, width, {
        ["component-prop-href"]: "href-new-value",
      }).href
    ).toBe("href-new-value");
  });

  it("should forward component props properly", () => {
    const refs = makeDefaultProject();

    const childComponent = makeComponent({
      props: [makeComponentProp({ name: "child-component-prop" })],
      layout: makeLinkLayer(refs, {
        bindings: {
          href: {
            propName: "child-component-prop",
          },
        },
      }),
    });

    refs.components = set(refs.components, "childComponentId", childComponent);

    const componentLayer = makeComponentLayer(
      refs,
      "layer-name",
      "childComponentId",
      {
        bindings: {
          ["child-component-prop"]: {
            propName: "parent-component-prop",
          },
        },
      }
    );

    const parentComponent = makeComponent({
      props: [makeComponentProp({ name: "parent-component-prop" })],
      layout: componentLayer,
    });

    refs.components = set(
      refs.components,
      "parentComponentId",
      parentComponent
    );

    expect(
      forwardJsxLayerProps(componentLayer, refs, width, {
        ["parent-component-prop"]: "prop-value",
      })
    ).toEqual({
      "child-component-prop": "prop-value",
    });
  });
});
