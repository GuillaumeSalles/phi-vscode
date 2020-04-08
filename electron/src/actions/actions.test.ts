import * as T from "../types";
import {
  deleteComponentPropHandler,
  editComponentPropHandler,
  addLayerActionHandler,
} from "../actions";
import {
  makeContainerLayer,
  makeTextLayer,
  makeComponentLayer,
  makeDefaultProject,
  makeComponent,
} from "../factories";
import { getComponentOrThrow } from "../layerUtils";

function makeRefsFixture(): T.Refs {
  return makeDefaultProject();
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
        bindings: { content: { propName: prop } },
      }),
      examples: [],
    });
    const newRefs = deleteComponentPropHandler(
      {
        type: "deleteComponentProp",
        componentId,
        prop,
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
              makeTextLayer(refs, {
                bindings: { content: { propName: prop } },
              }),
            ],
          }),
        ],
      }),
      examples: [],
    });
    const newRefs = deleteComponentPropHandler(
      {
        type: "deleteComponentProp",
        componentId,
        prop,
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
      examples: [],
    });

    const parentComponent: T.Component = {
      name: "parentComponent",
      props: [
        {
          name: "dummmy-prop",
          type: "text",
        },
      ],
      layout: {
        ...makeComponentLayer(refs, "child", componentId),
        props: {
          [prop]: "text",
        },
        bindings: {
          [prop]: {
            propName: "dummyProp",
          },
        },
      },
      examples: [],
    };
    refs.components.set(parentComponentId, parentComponent);
    const newRefs = deleteComponentPropHandler(
      {
        type: "deleteComponentProp",
        componentId,
        prop,
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
      examples: [],
    });
    const newRefs = editComponentPropHandler(
      {
        type: "editComponentProp",
        componentId,
        oldProp: oldProp,
        newProp: newProp,
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
    const newRefs = addLayerActionHandler(
      {
        type: "addLayer",
        componentId: "componentId",
        layerType: "text",
        layerId,
      },
      refs
    );

    expect(getComponentOrThrow("componentId", newRefs).layout!.id).toBe(
      layerId
    );

    if (newRefs.uiState.type !== "component") {
      fail("component view should be displayed after adding a layer");
    }

    expect(newRefs.uiState.componentId).toBe("componentId");
    expect(newRefs.uiState.layerId).toBe(layerId);
  });

  test("should add layer with a specific parent layer id", () => {
    const refs = makeRefsFixture();
    const layerId = "newLayerId";
    refs.components.set(
      "componentId",
      makeComponent({
        layout: makeContainerLayer(refs, {
          id: "parentLayer",
        }),
      })
    );
    const newRefs = addLayerActionHandler(
      {
        type: "addLayer",
        componentId: "componentId",
        layerType: "text",
        layerId,
        parentLayerId: "parentLayer",
      },
      refs
    );

    const component = getComponentOrThrow("componentId", newRefs);

    if (component.layout == null) {
      fail("Add layer should not delete component layout");
    }

    expect(component.layout.id).toBe("parentLayer");

    if (component.layout.type !== "container") {
      fail("Expected component layout to be a container");
    }

    expect(component.layout.children[0].id).toBe(layerId);
  });
});
