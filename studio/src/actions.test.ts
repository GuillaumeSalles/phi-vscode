import * as T from "./types";
import { deleteComponentProp, editComponentProp } from "./actions";
import {
  makeContainerLayer,
  makeDefaultColors,
  makeDefaultFontSizes,
  makeDefaultFontFamilies,
  makeDefaultBreakpoints,
  makeTextLayer,
  makeComponentLayer
} from "./factories";

function makeRefsFixture(): T.Refs {
  return {
    isSaved: true,
    fileName: "",
    colors: makeDefaultColors(),
    fontSizes: makeDefaultFontSizes(),
    fontFamilies: makeDefaultFontFamilies(),
    breakpoints: makeDefaultBreakpoints(),
    components: new Map()
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
      layout: makeTextLayer(refs, { bindings: { content: { propName: prop } } })
    });
    const newComponents = deleteComponentProp(
      {
        type: "deleteComponentProp",
        componentId,
        prop
      },
      refs
    );
    expect(newComponents.get(componentId)!.props).toEqual([]);
    expect(newComponents.get(componentId)!.layout!.bindings).toEqual({});
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
      })
    });
    const newComponents = deleteComponentProp(
      {
        type: "deleteComponentProp",
        componentId,
        prop
      },
      refs
    );
    const newComponent = newComponents.get(componentId)!;
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
      props: [{ name: "my-prop", type: "text" }]
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
      }
    };
    refs.components.set(parentComponentId, parentComponent);
    const newComponents = deleteComponentProp(
      {
        type: "deleteComponentProp",
        componentId,
        prop
      },
      refs
    );
    const newParentComponent = newComponents.get(parentComponentId)!;
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
      props: [{ name: oldProp, type: "text" }]
    });
    const newComponents = editComponentProp(
      {
        type: "editComponentProp",
        componentId,
        oldProp: oldProp,
        newProp: newProp
      },
      refs
    );
    const component = newComponents.get(componentId)!;
    expect(component.props).toEqual([{ name: newProp, type: "text" }]);
  });
});
