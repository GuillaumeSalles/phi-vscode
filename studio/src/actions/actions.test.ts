import * as T from "../types";
import {
  deleteComponentProp,
  editComponentProp,
  default as applyActions
} from "../actions";
import {
  makeContainerLayer,
  makeDefaultColors,
  makeDefaultFontSizes,
  makeDefaultFontFamilies,
  makeDefaultBreakpoints,
  makeTextLayer,
  makeComponentLayer
} from "../factories";
import { getComponentOrThrow } from "../layerUtils";

function makeRefsFixture(): T.Refs {
  return {
    selectedLayerId: undefined,
    artboards: new Map(),
    isSaved: true,
    fileName: "",
    colors: makeDefaultColors(),
    fontSizes: makeDefaultFontSizes(),
    fontFamilies: makeDefaultFontFamilies(),
    breakpoints: makeDefaultBreakpoints(),
    components: new Map()
  };
}

function makeComponent(overrides: Partial<T.Component> = {}): T.Component {
  return {
    name: "component-name",
    props: [],
    examples: [],
    ...overrides
  };
}

describe("deleteComponentProp", () => {
  test("should delete prop and remove binding that use prop", () => {
    const refs = makeRefsFixture();
    const componentId = "componentId";
    const prop = "my-prop";
    refs.components.set(componentId, {
      name: "name",
      props: [{ name: "my-prop", type: "text" }],
      layout: makeTextLayer(refs, {
        bindings: { content: { propName: prop } }
      }),
      examples: []
    });
    const newRefs = deleteComponentProp(
      {
        type: "deleteComponentProp",
        componentId,
        prop
      },
      refs
    );
    expect(newRefs.components.get(componentId)!.props).toEqual([]);
    expect(newRefs.components.get(componentId)!.layout!.bindings).toEqual({});
  });

  test("should remove binding that use prop for deep child", () => {
    const refs = makeRefsFixture();
    const componentId = "componentId";
    const prop = "my-prop";
    refs.components.set(componentId, {
      name: "name",
      props: [{ name: "my-prop", type: "text" }],
      layout: makeContainerLayer(refs, {
        children: [
          makeContainerLayer(refs, {
            children: [
              makeTextLayer(refs, { bindings: { content: { propName: prop } } })
            ]
          })
        ]
      }),
      examples: []
    });
    const newRefs = deleteComponentProp(
      {
        type: "deleteComponentProp",
        componentId,
        prop
      },
      refs
    );
    const newComponent = newRefs.components.get(componentId)!;
    const layout = newComponent.layout as T.ContainerLayer;
    const textLayer = (layout.children[0] as T.ContainerLayer)
      .children[0] as T.TextLayer;
    expect(textLayer.bindings).toEqual({});
  });

  test("should prop assignement and bindings from component that use the prop", () => {
    const refs = makeRefsFixture();
    const componentId = "componentId";
    const parentComponentId = "parentComponentId";
    const prop = "my-prop";
    refs.components.set(componentId, {
      name: "name",
      props: [{ name: "my-prop", type: "text" }],
      examples: []
    });

    const parentComponent: T.Component = {
      name: "parentComponent",
      props: [
        {
          name: "dummmy-prop",
          type: "text"
        }
      ],
      layout: {
        ...makeComponentLayer(refs, "child", componentId),
        props: {
          [prop]: "text"
        },
        bindings: {
          [prop]: {
            propName: "dummyProp"
          }
        }
      },
      examples: []
    };
    refs.components.set(parentComponentId, parentComponent);
    const newRefs = deleteComponentProp(
      {
        type: "deleteComponentProp",
        componentId,
        prop
      },
      refs
    );
    const newParentComponent = newRefs.components.get(parentComponentId)!;
    const newComponentLayer = newParentComponent.layout as T.ComponentLayer;
    expect(newComponentLayer.props).toEqual({});
    expect(newComponentLayer.bindings).toEqual({});
  });
});

describe("editComponentProp", () => {
  test("should rename prop", () => {
    const refs = makeRefsFixture();
    const componentId = "componentId";
    const oldProp = "old";
    const newProp = "new";
    refs.components.set(componentId, {
      name: "name",
      props: [{ name: oldProp, type: "text" }],
      examples: []
    });
    const newRefs = editComponentProp(
      {
        type: "editComponentProp",
        componentId,
        oldProp: oldProp,
        newProp: newProp
      },
      refs
    );
    const component = newRefs.components.get(componentId)!;
    expect(component.props).toEqual([{ name: newProp, type: "text" }]);
  });
});

describe("addLayer", () => {
  test("should add layer and select it", () => {
    const refs = makeRefsFixture();
    const layerId = "newLayerId";
    refs.components.set("componentId", makeComponent());
    const newRefs = applyActions(
      {
        type: "addLayer",
        componentId: "componentId",
        layerType: "text",
        layerId
      },
      refs
    );

    expect(getComponentOrThrow("componentId", newRefs).layout!.id).toBe(
      layerId
    );
    expect(newRefs.selectedLayerId).toBe(layerId);
  });
});
