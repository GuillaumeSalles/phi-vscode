/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { column, mainPadding, row, colors } from "../../styles";
import * as T from "../../types";
import {
  filterComponentsWhenLayer,
  uiStateComponentOrThrow,
} from "../../refsUtil";
import Component from "./Component";
// import SettingsEditor from "./SettingsEditor";
import CodeExamples from "./CodeExamples";
import SecondaryButton from "../../components/SecondaryButton";
import LayersTree from "../../components/LayersTree";
import LayerEditor from "./Editors/LayerEditor";
import HtmlEditor from "./Editors/HtmlEditor";
import { Layout } from "../../components/Layout";
import ComponentProps from "./ComponentProps";
import { findLayerByIdWithParent } from "../../layerUtils";
import { useWarningDialog } from "../../hooks";
import HtmlLayerBindings from "./Editors/HtmlLayerBindings";
import OkCancelModal from "../../components/OkCancelModal";
import Button from "../../components/Button";
import {
  useStringFormEntry,
  useDialogForm,
  FormInput,
} from "../../components/Form";
import { validateRefName } from "../../validators";
import ComponentExamplesEditor from "./Editors/ComponentExamplesEditor";
import Toolbar from "./Toolbar";
import { stopKeydownPropagationIfNecessary } from "../../utils";

const tabStyle = css({
  display: "flex",
  flex: "1 1 auto",
  fontSize: "14px",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  cursor: "pointer",
  color: colors.sideBarForeground,
  background: colors.sideBarBackground,
});

const selectedTabStyle = css(tabStyle, {
  background: colors.sideBarSectionHeaderBackground,
});

type Props = {
  menu: React.ReactNode;
  componentId: string;
  layerId?: string;
  refs: T.Refs;
  applyAction: T.ApplyAction;
};

function ComponentView({
  menu,
  refs,
  applyAction,
  componentId,
  layerId,
}: Props) {
  const component = refs.components.get(componentId)!;
  const uiState = uiStateComponentOrThrow(refs);

  const nameEntry = useStringFormEntry("", (value) =>
    validateRefName(value, componentId, refs.components, "Components")
  );
  const renameComponentDialog = useDialogForm([nameEntry], () => {
    applyAction({
      type: "renameComponent",
      componentId,
      name: nameEntry.value,
    });
  });

  const componentsThatUseCurrentComponent = filterComponentsWhenLayer(
    refs,
    (l) => l.type === "component" && l.componentId === componentId
  );
  const deleteRefDialog = useWarningDialog(
    `Can't delete component ${component.name}`,
    `${component.name} is used by ${componentsThatUseCurrentComponent
      .map((c) => `"${c.name}"`)
      .join(", ")}.`
  );

  const isEditingHTML = uiState.layerEditorMode === "html";

  const { layer: selectedLayer, parent } =
    component.layout && layerId
      ? findLayerByIdWithParent(component.layout, layerId)
      : { layer: undefined, parent: undefined };

  return (
    <Layout
      topBar={
        <div
          css={[
            row,
            {
              alignItems: "center",
              height: "48px",
              background: colors.topBarBackground,
            },
          ]}
        >
          <div css={{ flex: "0", width: "200px", minWidth: "200px" }}>
            {uiState.isEditing && (
              <Toolbar applyAction={applyAction} refs={refs} />
            )}
          </div>
          <div
            css={[
              row,
              {
                flex: "1 1 auto",
                alignItems: "center",
                justifyContent: "center",
                width: "300px",
              },
            ]}
          >
            <div
              css={{
                margin: "0",
                fontWeight: 400,
                fontSize: "18px",
              }}
            >
              {component.name}
            </div>
          </div>
          <div css={[row]}>
            {uiState.isEditing ? (
              <React.Fragment>
                <Button
                  margin="0 12px 0 0"
                  text="Done"
                  onClick={() => applyAction({ type: "stopEditComponent" })}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  text="Edit"
                  margin="0 12px 0 0"
                  onClick={() => {
                    applyAction({
                      type: "editComponent",
                    });
                  }}
                />
                <Button
                  margin="0 12px 0 0"
                  text="Rename"
                  onClick={() => {
                    renameComponentDialog.open();
                    nameEntry.setValue(component.name);
                  }}
                />
                <Button
                  text="Delete"
                  margin="0 12px 0 0"
                  onClick={() => {
                    if (componentsThatUseCurrentComponent.length === 0) {
                      applyAction({ type: "deleteComponent", componentId });
                    } else {
                      deleteRefDialog.open();
                    }
                  }}
                />
              </React.Fragment>
            )}
          </div>
          {/* <SettingsEditor refs={refs} applyAction={applyAction} /> */}
        </div>
      }
      left={
        uiState.isEditing ? (
          <>
            <LayersTree
              layerId={layerId}
              componentId={componentId}
              root={component.layout}
              refs={refs}
              applyAction={applyAction}
            />
            <ComponentProps
              component={component}
              componentId={componentId}
              applyAction={applyAction}
            />
          </>
        ) : (
          menu
        )
      }
      center={
        <div
          css={[
            column,
            { height: "100%", overflowX: "hidden", paddingTop: "20px" },
          ]}
        >
          <div
            css={[
              column,
              mainPadding,
              {
                flex: "1 1 auto",
                overflowX: "auto",
                "::-webkit-scrollbar-corner": {
                  background: "transparent",
                },
              },
            ]}
          >
            <Component
              key={componentId}
              component={component}
              refs={refs}
              applyAction={applyAction}
              selectedLayer={selectedLayer}
            />
            <OkCancelModal
              {...deleteRefDialog.dialogProps}
              buttons={<Button text="Ok" {...deleteRefDialog.okProps} />}
            />
            <OkCancelModal
              title="Rename component"
              {...renameComponentDialog.dialogProps}
              buttons={
                <React.Fragment>
                  <SecondaryButton
                    text="Cancel"
                    {...renameComponentDialog.cancelButtonProps}
                  />
                  <Button text="Add" {...renameComponentDialog.okButtonProps} />
                </React.Fragment>
              }
              form={
                <React.Fragment>
                  <FormInput
                    placeholder="Name your component"
                    {...nameEntry.inputProps}
                  />
                </React.Fragment>
              }
            />
          </div>
          {uiState.isEditing === false && (
            <CodeExamples component={component} />
          )}
        </div>
      }
      right={
        uiState.isEditing && selectedLayer ? (
          <div
            onKeyDown={stopKeydownPropagationIfNecessary}
            css={[
              column,
              {
                flexShrink: 0,
                width: "268px",
                minWidth: "268px",
                background: colors.sideBarBackground,
                height: "100%",
              },
            ]}
          >
            <div
              css={[
                row,
                {
                  flex: "0 0 auto",
                  height: "40px",
                  alignItems: "stretch",
                },
              ]}
            >
              <button
                css={isEditingHTML ? selectedTabStyle : tabStyle}
                onClick={() =>
                  applyAction({ type: "setLayerEditorMode", mode: "html" })
                }
              >
                HTML
              </button>
              <button
                css={isEditingHTML ? tabStyle : selectedTabStyle}
                onClick={() =>
                  applyAction({ type: "setLayerEditorMode", mode: "css" })
                }
              >
                CSS
              </button>
            </div>
            {isEditingHTML ? (
              <>
                <HtmlEditor
                  componentId={componentId}
                  component={component}
                  layer={selectedLayer}
                  refs={refs}
                  applyAction={applyAction}
                />
                <HtmlLayerBindings
                  componentId={componentId}
                  component={component}
                  layer={selectedLayer}
                  refs={refs}
                  bindings={selectedLayer.bindings}
                  applyAction={applyAction}
                />
              </>
            ) : (
              <LayerEditor
                layer={selectedLayer}
                parentLayer={parent}
                refs={refs}
                componentId={componentId}
                applyAction={applyAction}
              />
            )}
          </div>
        ) : (
          <div
            css={[
              column,
              {
                flexShrink: 0,
                width: "268px",
                minWidth: "268px",
                background: colors.sideBarBackground,
                height: "100%",
              },
            ]}
          >
            <ComponentExamplesEditor
              component={component}
              componentId={componentId}
              applyAction={applyAction}
            />
          </div>
        )
      }
    />
  );
}

export default ComponentView;
